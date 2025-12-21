import React from "react";
import { theme } from "../theme";
import { Icons } from "./icons";

export function Modal({
  isOpen,
  title,
  onClose,
  children,
  footer,
  width = 640,
}: {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 50,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: width,
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: 16,
          padding: 20,
          boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: theme.text }}>{title}</div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: theme.textSecondary,
              cursor: "pointer",
            }}
          >
            <Icons.X />
          </button>
        </div>
        <div style={{ display: "grid", gap: 12 }}>{children}</div>
        {footer && <div style={{ marginTop: 20 }}>{footer}</div>}
      </div>
    </div>
  );
}
