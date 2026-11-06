import { LogOut } from "lucide-react";
import { memberSignOut } from "@/app/members/actions";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Sign-out button that posts to the memberSignOut server action */
export function SignOutButton({
  className,
  variant = "outline",
  size = "md",
  label = "Sign out",
}: {
  className?: string;
  variant?: "outline" | "cream" | "ghost" | "primary";
  size?: "sm" | "md";
  label?: string;
}) {
  return (
    <form action={memberSignOut} className="inline-flex">
      <button type="submit" className={cn(buttonClasses({ variant, size }), className)}>
        <LogOut className="h-4 w-4" aria-hidden />
        <span>{label}</span>
      </button>
    </form>
  );
}
