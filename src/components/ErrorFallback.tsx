import { useRouteError } from "react-router-dom";
import { AlertCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-4 py-8">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="text-xl font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground">
          We hit an unexpected error. You can return to the login screen and try
          again. Your recent data on this device will be cleared.
        </p>
        {error?.message && (
          <p className="max-h-24 overflow-auto rounded-md bg-muted px-3 py-2 text-left text-xs text-muted-foreground">
            {error.message}
          </p>
        )}
        <Button
          onClick={handleReturnToLogin}
          variant="default"
          size="lg"
          className="mt-2 gap-2"
        >
          <LogOut className="h-4 w-4" />
          Return to login
        </Button>
      </div>
    </div>
  );
}
