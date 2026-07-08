import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useUIState } from "@/stores/ui";
import { cn } from "@/lib/utils";

const typeConfig = {
  success: { icon: CheckCircle, iconClass: "text-success" },
  error: { icon: AlertCircle, iconClass: "text-destructive" },
  warning: { icon: AlertTriangle, iconClass: "text-destructive" },
  info: { icon: Info, iconClass: "text-muted-foreground" },
};

export function NotificationToaster() {
  const { notifications, removeNotification } = useUIState();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 mx-auto flex w-full max-w-sm flex-col gap-2 p-4 pt-safe"
      aria-live="polite"
    >
      {notifications.map((n) => {
        const config = typeConfig[n.type];
        const Icon = config.icon;
        return (
          <div
            key={n.id}
            className={cn(
              "animate-rise-in pointer-events-auto flex items-start gap-3 rounded-2xl border border-border bg-card p-3 text-card-foreground shadow-(--shadow-card)"
            )}
          >
            <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", config.iconClass)} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{n.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>
            </div>
            <button
              type="button"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              onClick={() => removeNotification(n.id)}
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
