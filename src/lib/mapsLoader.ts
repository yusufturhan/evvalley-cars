import { Loader } from "@googlemaps/js-api-loader";

let googlePromise: Promise<any> | null = null;
const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  version: "weekly",
  libraries: ["places"],
});

/**
 * Load Google Maps JS API once (new importLibrary API).
 */
export function getGoogleMaps(): Promise<any> {
  if (googlePromise) return googlePromise;

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return Promise.reject(
      new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set")
    );
  }

  googlePromise = (async () => {
    // Load required libraries; returns the library but also ensures window.google is available
    await loader.importLibrary("places");
    await loader.importLibrary("maps");
    return (window as any).google;
  })();

  return googlePromise;
}

