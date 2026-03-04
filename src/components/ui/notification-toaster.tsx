import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useUIState } from "@/stores/ui";
import { Button } from "./button";
import { cn } from "@/lib/utils";

const typeConfig = {
  success: {
    icon: CheckCircle,
    className: "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  error: {
    icon: AlertCircle,
    className: "border-destructive/50 bg-destructive/10 text-destructive",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  info: {
    icon: Info,
    className: "border-primary/50 bg-primary/10 text-primary",
  },
};

export function NotificationToaster() {
  const { notifications, removeNotification } = useUIState();

  return (
    <div
      className="pointer-events-none fixed top-0 right-0 z-50 flex w-full max-w-sm flex-col gap-2 p-4 pt-safe-top sm:pointer-events-auto"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => {
          const config = typeConfig[n.type];
          const Icon = config.icon;
          return (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 80 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-lg border p-3 shadow-lg backdrop-blur-sm",
                config.className
              )}
            >
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">{n.title}</p>
                <p className="text-xs opacity-90 mt-0.5">{n.message}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-70 hover:opacity-100"
                onClick={() => removeNotification(n.id)}
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
