import { Link, Outlet, useLocation } from "react-router-dom";
import { Icons } from "../components/icons";
import { theme } from "../theme";

const pages = [
  { key: "admin", label: "Admin", description: "Configuration & guardrails", icon: "Settings", section: "management", path: "/admin/setup" },
  { key: "students", label: "Students", description: "Student roster & progress", icon: "Users", section: "management", path: "/students" },
  { key: "instructors", label: "Instructors", description: "Availability & coverage", icon: "UserCheck", section: "management", path: "/instructors" },
  { key: "calendar", label: "Calendar", description: "Appointments calendar", icon: "Calendar", section: "scheduling", path: "/calendar" },
  { key: "schedule", label: "Schedule", description: "Quick add scheduling", icon: "Clock", section: "scheduling", path: "/schedule" },
  { key: "communications", label: "Communications", description: "Templates & triggers", icon: "Mail", section: "operations", path: "/communications" },
  { key: "payments", label: "Payments", description: "Balances & receipts", icon: "CreditCard", section: "operations", path: "/payments" },
  { key: "crm", label: "CRM", description: "Leads & partners", icon: "Briefcase", section: "operations", path: "/crm" },
  { key: "metrics", label: "Data Tracking", description: "KPIs & analytics", icon: "BarChart", section: "insights", path: "/metrics" },
  { key: "portal", label: "Student Portal", description: "Hours & progress", icon: "GraduationCap", section: "learning", path: "/portal" },
  { key: "lms", label: "Learning", description: "Course modules", icon: "BookOpen", section: "learning", path: "/learning" },
  { key: "registration", label: "Registration", description: "Class catalog", icon: "ClipboardList", section: "learning", path: "/registration" },
  { key: "payroll", label: "Payroll", description: "Rules & runs", icon: "DollarSign", section: "admin", path: "/payroll" },
  { key: "dmv", label: "DMV Compliance", description: "Completion reports", icon: "Shield", section: "admin", path: "/dmv" },
  { key: "close", label: "Exit Demo", description: "Return to app", icon: "LogOut", section: "system", path: "/students" },
];

const sections = [
  { key: "management", label: "Management" },
  { key: "scheduling", label: "Scheduling" },
  { key: "operations", label: "Operations" },
  { key: "insights", label: "Insights" },
  { key: "learning", label: "Learning" },
  { key: "admin", label: "Administration" },
  { key: "system", label: null },
];

function NavItem({ page, isActive }: { page: typeof pages[number]; isActive: boolean }) {
  const IconComponent = (Icons as Record<string, React.FC | undefined>)[page.icon];
  return (
    <Link
      to={page.path}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "10px 12px",
        background: isActive ? theme.gradientSubtle : "transparent",
        border: "none",
        borderRadius: 10,
        cursor: "pointer",
        transition: "all 0.15s ease",
        position: "relative",
        textAlign: "left",
        textDecoration: "none",
      }}
    >
      {isActive && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: 3,
            height: 20,
            background: theme.gradient,
            borderRadius: "0 3px 3px 0",
          }}
        />
      )}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: isActive ? theme.accentGlow : "rgba(255,255,255,0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isActive ? theme.accent : theme.textSecondary,
          transition: "all 0.15s ease",
        }}
      >
        {IconComponent && <IconComponent />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: isActive ? 600 : 500,
            color: isActive ? theme.text : theme.textSecondary,
            transition: "all 0.15s ease",
          }}
        >
          {page.label}
        </div>
        <div
          style={{
            fontSize: 11,
            color: theme.textMuted,
            marginTop: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {page.description}
        </div>
      </div>
    </Link>
  );
}

export default function AppLayout() {
  const location = useLocation();

  return (
    <div
      style={{
        minHeight: "100vh",
        height: "100vh",
        background: theme.bg,
        fontFamily: theme.font,
        color: theme.text,
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        overflow: "hidden",
      }}
    >
      <aside
        style={{
          background: theme.panel,
          borderRight: `1px solid ${theme.border}`,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 16px",
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: theme.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
              }}
            >
              <Icons.Car />
            </div>
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: theme.text,
                  letterSpacing: "-0.01em",
                }}
              >
                Checkmate
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: theme.textMuted,
                  marginTop: 1,
                }}
              >
                Driving School ERP
              </div>
            </div>
          </div>
        </div>

        <nav
          style={{
            flex: 1,
            overflow: "auto",
            padding: "12px 10px",
          }}
        >
          {sections.map((section) => {
            const sectionPages = pages.filter((page) => page.section === section.key);
            if (sectionPages.length === 0) return null;
            return (
              <div key={section.key} style={{ marginBottom: 8 }}>
                {section.label && (
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: theme.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      padding: "12px 12px 8px",
                    }}
                  >
                    {section.label}
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {sectionPages.map((page) => {
                    const isActive = location.pathname === page.path || location.pathname.startsWith(`${page.path}/`);
                    return <NavItem key={page.key} page={page} isActive={isActive} />;
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div
          style={{
            padding: "16px",
            borderTop: `1px solid ${theme.border}`,
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              background: theme.surface,
              borderRadius: 12,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: theme.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              AD
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Admin User</div>
              <div style={{ fontSize: 11, color: theme.textMuted }}>Demo Mode</div>
            </div>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: theme.success,
                boxShadow: `0 0 8px ${theme.success}`,
              }}
            />
          </div>
        </div>
      </aside>

      <main
        style={{
          padding: 24,
          height: "100vh",
          overflow: "auto",
          background: `
            radial-gradient(ellipse at 0% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
            ${theme.bg}
          `,
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
