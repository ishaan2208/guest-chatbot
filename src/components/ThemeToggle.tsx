import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

/**
 * Light/dark switch. Derives the shown state from the theme value (reactive,
 * so the icon stays in sync across reloads), and flips to the explicit
 * opposite on tap.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const systemDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = theme === "dark" || (theme === "system" && systemDark);

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-[background-color,color,transform] duration-150 ease-out hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:active:scale-[0.94]",
        className
      )}
    >
      <Sun
        className={cn(
          "absolute h-[18px] w-[18px] transition-[opacity,transform] duration-200 ease-out",
          isDark ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          "absolute h-[18px] w-[18px] transition-[opacity,transform] duration-200 ease-out",
          isDark ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
        )}
        aria-hidden="true"
      />
    </button>
  );
}
