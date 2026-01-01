import { Loader } from "@googlemaps/js-api-loader";

let googlePromise: Promise<any> | null = null;
let loader: Loader | null = null;

/**
 * Load Google Maps JS API once (client-side only).
 */
export function getGoogleMaps(): Promise<any> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Google Maps loader must be called in the browser")
    );
  }

  if (googlePromise) return googlePromise;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return Promise.reject(
      new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set")
    );
  }

  if (!loader) {
    loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places"],
    });
  }

  googlePromise = (async () => {
    await loader!.importLibrary("places");
    await loader!.importLibrary("maps");
    return (window as any).google;
  })();

  return googlePromise;
}

