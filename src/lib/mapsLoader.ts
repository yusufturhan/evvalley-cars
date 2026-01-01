import { Loader } from "@googlemaps/js-api-loader";

let googlePromise: Promise<any> | null = null;

export function getGoogleMaps(): Promise<any> {
  if (googlePromise) return googlePromise;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return Promise.reject(
      new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set")
    );
  }

  const loader = new Loader({
    apiKey,
    version: "weekly",
    libraries: ["places"],
  });

  googlePromise = loader.load();
  return googlePromise;
}

