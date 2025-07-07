import React from "react";
import { colors } from "../styles/tokens/colors";
import { typography } from "../styles/tokens/typography";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  ...props
}) => (
  <button
    style={{
      background: variant === "primary" ? colors.primary : colors.secondary,
      color: variant === "primary" ? colors.background : colors.text,
      border: `1px solid ${variant === "primary" ? colors.primary : colors.border}`,
      borderRadius: 8,
      padding: "12px 20px",
      fontWeight: typography.fontWeight.bold,
      fontSize: typography.fontSize.md,
      fontFamily: typography.fontFamily,
      cursor: "pointer",
      transition: "background 0.2s, color 0.2s",
    }}
    {...props}
  >
    {children}
  </button>
);

export default Button; 