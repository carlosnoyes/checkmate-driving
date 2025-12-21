import csv
from datetime import datetime
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from django.utils.text import slugify

from apps.appointments.models import Appointment
from apps.resources.models import Car, ClassKey, InstructorAvailability, Location
from apps.students.models import Student
from apps.users.models import User


class Command(BaseCommand):
    help = "Load example CSV data into the database."

    def add_arguments(self, parser):
        parser.add_argument("--path", type=str, default="", help="Override CSV directory path")

    def handle(self, *args, **options):
        base_dir = Path(options["path"]) if options["path"] else settings.BASE_DIR.parent / "frontend" / "dist" / "example_data"
        if not base_dir.exists():
            self.stderr.write(self.style.ERROR(f"Example data directory not found: {base_dir}"))
            return

        with transaction.atomic():
            self._load_locations(base_dir / "locations.csv")
            self._load_cars(base_dir / "cars.csv")
            self._load_class_keys(base_dir / "class_keys.csv")
            instructors = self._load_instructors(base_dir / "teachers.csv", base_dir / "instructor_availability.csv")
            students = self._load_students(base_dir / "students.csv", instructors)
            self._load_appointments(base_dir / "appointments.csv", students, instructors)
            self._load_availability(base_dir / "instructor_availability.csv", instructors)

        self.stdout.write(self.style.SUCCESS("Example data loaded."))

    def _load_locations(self, path: Path):
        if not path.exists():
            return
        with path.open(newline="", encoding="utf-8") as handle:
            reader = csv.DictReader(handle)
            for row in reader:
                name = (row.get("Location") or "").strip()
                if name:
                    Location.objects.get_or_create(name=name)

    def _load_cars(self, path: Path):
        if not path.exists():
            return
        with path.open(newline="", encoding="utf-8") as handle:
            reader = csv.DictReader(handle)
            for row in reader:
                name = (row.get("Car ID") or "").strip()
                if name:
                    Car.objects.get_or_create(name=name)

    def _load_class_keys(self, path: Path):
        if not path.exists():
            return
        with path.open(newline="", encoding="utf-8") as handle:
            reader = csv.DictReader(handle)
            for row in reader:
                key = (row.get("Class Key") or "").strip()
                length_raw = (row.get("Class Length") or "").strip()
                if not key or not length_raw:
                    continue
                ClassKey.objects.get_or_create(
                    key=key,
                    defaults={"class_length_minutes": int(length_raw)},
                )

    def _load_instructors(self, teachers_path: Path, availability_path: Path):
        names = set()
        for path in [teachers_path, availability_path]:
            if not path.exists():
                continue
            with path.open(newline="", encoding="utf-8") as handle:
                reader = csv.DictReader(handle)
                for row in reader:
                    name = (row.get("Teacher Name") or row.get("name") or "").strip()
                    if name:
                        names.add(name)

        instructors = {}
        for name in sorted(names):
            parts = name.split()
            first_name = parts[0]
            last_name = " ".join(parts[1:]) if len(parts) > 1 else ""
            username = slugify(name) or slugify(f"instructor-{name}")
            email = f"{username}@example.com"
            user, _ = User.objects.get_or_create(
                username=username,
                defaults={
                    "first_name": first_name,
                    "last_name": last_name,
                    "email": email,
                    "role": "instructor",
                },
            )
            instructors[name] = user
        return instructors

    def _load_students(self, path: Path, instructors):
        if not path.exists():
            return {}
        students = {}
        with path.open(newline="", encoding="utf-8") as handle:
            reader = csv.DictReader(handle)
            for row in reader:
                student_id = (row.get("student_id") or "").strip()
                name = (row.get("name") or "").strip()
                if not student_id or not name:
                    continue
                parts = name.split()
                first_name = parts[0]
                last_name = " ".join(parts[1:]) if len(parts) > 1 else ""
                status_raw = (row.get("enrollment_status") or "Active").strip().lower()
                status = {
                    "active": "active",
                    "paused": "paused",
                    "graduated": "graduated",
                }.get(status_raw.lower(), "active")
                payment_status = (row.get("payment_status") or "Pending").strip().lower()
                instructor_name = (row.get("assigned_instructor") or "").strip()
                assigned_instructor = instructors.get(instructor_name)
                email = f"{student_id.lower()}@example.com"
                student, _ = Student.objects.get_or_create(
                    student_id=student_id,
                    defaults={
                        "first_name": first_name,
                        "last_name": last_name,
                        "email": email,
                        "status": status,
                        "program_track": (row.get("program_track") or "").strip(),
                        "next_drive": self._parse_date(row.get("next_drive")),
                        "assigned_instructor": assigned_instructor,
                        "hours_logged": int(row.get("hours_logged") or 0),
                        "required_hours": int(row.get("required_hours") or 20),
                        "permit_expiration": self._parse_date(row.get("permit_expiration")),
                        "payment_status": payment_status if payment_status else "pending",
                    },
                )
                students[name] = student
        return students

    def _load_appointments(self, path: Path, students, instructors):
        if not path.exists():
            return
        with path.open(newline="", encoding="utf-8") as handle:
            reader = csv.DictReader(handle)
            for row in reader:
                student_name = (row.get("Student Name") or "").strip()
                teacher_name = (row.get("Teacher Name") or "").strip()
                date_raw = (row.get("Date") or "").strip()
                start_time = (row.get("Start Time") or "").strip()
                end_time = (row.get("End Time") or "").strip()
                if not student_name or not date_raw or not start_time or not end_time:
                    continue
                student = students.get(student_name)
                instructor = instructors.get(teacher_name)
                start_at = self._parse_datetime(date_raw, start_time)
                end_at = self._parse_datetime(date_raw, end_time)
                if not start_at or not end_at or not student:
                    continue
                status = "canceled" if (row.get("Canceled") or "").strip().upper() == "TRUE" else "scheduled"
                no_show = (row.get("No-Show") or "").strip().upper() == "TRUE"
                pudo = str(row.get("PUDO") or "0").strip() in ["1", "TRUE", "true", "Yes"]
                car = Car.objects.filter(name=(row.get("Car ID") or "").strip()).first()
                location = Location.objects.filter(name=(row.get("Location") or "").strip()).first()
                class_key = ClassKey.objects.filter(key=(row.get("Class ID") or "").strip()).first()
                Appointment.objects.get_or_create(
                    student=student,
                    start_at=start_at,
                    end_at=end_at,
                    defaults={
                        "instructor": instructor,
                        "status": status,
                        "no_show": no_show,
                        "pudo": pudo,
                        "car": car,
                        "location": location,
                        "class_key": class_key,
                        "notes": (row.get("Notes") or "").strip(),
                    },
                )

    def _load_availability(self, path: Path, instructors):
        if not path.exists():
            return
        with path.open(newline="", encoding="utf-8") as handle:
            reader = csv.DictReader(handle)
            for row in reader:
                name = (row.get("name") or "").strip()
                day = (row.get("day") or "").strip()
                start_time = (row.get("start") or "").strip()
                end_time = (row.get("end") or "").strip()
                if not name or not day or not start_time or not end_time:
                    continue
                instructor = instructors.get(name)
                if not instructor:
                    continue
                location = Location.objects.filter(name=(row.get("location") or "").strip()).first()
                InstructorAvailability.objects.get_or_create(
                    instructor=instructor,
                    day=day,
                    start_time=self._parse_time(start_time),
                    end_time=self._parse_time(end_time),
                    defaults={
                        "location": location,
                        "status": (row.get("status") or "Available").strip(),
                    },
                )

    def _parse_date(self, value):
        if not value:
            return None
        try:
            return datetime.strptime(value.strip(), "%Y-%m-%d").date()
        except ValueError:
            return None

    def _parse_time(self, value):
        if not value:
            return None
        return datetime.strptime(value.strip(), "%H:%M").time()

    def _parse_datetime(self, date_str, time_str):
        try:
            naive = datetime.strptime(f"{date_str} {time_str}", "%m/%d/%Y %I:%M %p")
        except ValueError:
            return None
        if settings.USE_TZ:
            return timezone.make_aware(naive, timezone.get_default_timezone())
        return naive
