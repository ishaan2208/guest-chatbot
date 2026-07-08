export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  // Cache-first SW + dev-server HMR is a footgun: a service worker registered
  // by an earlier *production* build keeps intercepting requests on this origin
  // and serving the stale cached shell — so source edits appear to "not take
  // effect" in dev. Skipping registration isn't enough; actively tear down any
  // existing worker + its caches so dev always self-heals to fresh source.
  if (!import.meta.env.PROD) {
    void unregisterInDev();
    return;
  }

  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("/sw.js");
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  });
}

async function unregisterInDev() {
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    if (regs.length === 0) return;
    await Promise.all(regs.map((r) => r.unregister()));
    if ("caches" in window && typeof caches.keys === "function") {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
    // The page is still controlled by the old worker until the next load;
    // reload once (guarded so we never loop) to escape the cached shell.
    if (navigator.serviceWorker.controller && !sessionStorage.getItem("sw-dev-reloaded")) {
      sessionStorage.setItem("sw-dev-reloaded", "1");
      window.location.reload();
    }
  } catch (error) {
    console.error("Dev service-worker cleanup failed:", error);
  }
}
