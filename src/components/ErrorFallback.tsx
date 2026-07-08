import { useRouteError } from "react-router-dom";
import { AlertCircle, LogOut } from "lucide-react";

/** Clear all local storage, session storage, and caches then go to login */
export async function clearStorageAndCaches(): Promise<void> {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {
    // ignore
  }
  try {
    if ("caches" in window && typeof caches.keys === "function") {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
    }
  } catch {
    // ignore
  }
}

export default function ErrorFallback() {
  const error = useRouteError() as Error & { statusText?: string; message?: string } | null;

  const handleReturnToLogin = async () => {
    await clearStorageAndCaches();
    window.location.href = "/login";
  };

  return (
    <div className="app-canvas flex min-h-dvh flex-col items-center justify-center gap-6 px-5 py-8">
      <div className="animate-rise-in flex w-full max-w-sm flex-col items-center gap-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-destructive/25 bg-destructive/5 text-destructive">
          <AlertCircle className="h-6 w-6" aria-hidden />
        </span>
        <h1 className="font-display text-2xl tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We hit an unexpected error. You can return to the login screen and try
          again. Your recent data on this device will be cleared.
        </p>
        {error?.message && (
          <p className="max-h-24 w-full overflow-auto rounded-xl border border-border bg-card px-3 py-2 text-left text-xs text-muted-foreground">
            {error.message}
          </p>
        )}
        <button
          type="button"
          onClick={handleReturnToLogin}
          className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-[15px] font-semibold text-primary-foreground transition-[opacity,transform] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Return to login
        </button>
      </div>
    </div>
  );
}
