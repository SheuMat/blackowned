import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "pink" | "outline" | "cream" | "ghost" | "sunflower";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-full font-heading font-semibold tracking-tight transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-espresso text-cream border-2 border-espresso hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-pink active:translate-x-0 active:translate-y-0 active:shadow-none",
  pink:
    "bg-pink text-espresso border-2 border-espresso shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop active:translate-x-0 active:translate-y-0 active:shadow-none",
  sunflower:
    "bg-sunflower text-espresso border-2 border-espresso shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop active:translate-x-0 active:translate-y-0 active:shadow-none",
  outline:
    "bg-transparent text-espresso border-2 border-espresso hover:bg-espresso hover:text-cream",
  cream:
    "bg-cream text-espresso border-2 border-cream hover:bg-pink hover:border-pink",
  ghost: "bg-transparent text-espresso hover:bg-espresso/5 border-2 border-transparent",
};

const sizes: Record<Size, string> = {
  // Looks compact, but the ::after pad keeps the tap target 44px tall
  sm: "relative h-9 px-4 text-sm after:absolute after:inset-x-0 after:-inset-y-1 after:content-['']",
  md: "h-11 px-5 text-[15px]",
  lg: "h-14 px-7 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  href,
  variant,
  size,
  icon,
  iconRight,
  className,
  children,
  external,
  ...rest
}: CommonProps & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href" | "className" | "children">) {
  const cls = buttonClasses({ variant, size, className });
  const inner = (
    <>
      {icon}
      <span>{children}</span>
      {iconRight && (
        <span className="transition-transform duration-200 group-hover/btn:translate-x-0.5">{iconRight}</span>
      )}
    </>
  );
  if (external || /^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a
        href={href}
        className={cls}
        {...(/^https?:/.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  );
}

export function Button({
  variant,
  size,
  icon,
  iconRight,
  className,
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={buttonClasses({ variant, size, className })} {...rest}>
      {icon}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}
