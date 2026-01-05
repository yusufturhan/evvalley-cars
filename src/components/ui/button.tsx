import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "primary", size = "md", disabled, ...props },
    ref
  ) => {
    // Base styles for all buttons
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    // Variant styles using design tokens only
    const variantStyles = {
      primary:
        "bg-primary text-primary-foreground hover:opacity-90 active:opacity-80",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-muted active:opacity-90",
      outline:
        "border border-border bg-background text-foreground hover:bg-muted active:bg-muted",
      ghost: "text-foreground hover:bg-muted active:bg-muted",
    };

    // Size styles
    const sizeStyles = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 py-2 text-base",
      lg: "h-11 px-8 text-lg",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
