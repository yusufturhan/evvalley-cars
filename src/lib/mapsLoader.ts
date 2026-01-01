let googlePromise: Promise<any> | null = null;

/**
 * Load Google Maps JS API once using the new importLibrary flow.
 * No deprecated Loader API is used.
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

  googlePromise = new Promise((resolve, reject) => {
    // If already available (e.g., another script), resolve immediately
    if ((window as any).google?.maps?.importLibrary) {
      resolve((window as any).google);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onerror = (err) => reject(err);
    script.onload = () => {
      if ((window as any).google?.maps?.importLibrary) {
        resolve((window as any).google);
      } else {
        reject(new Error("Google Maps failed to load importLibrary"));
      }
    };
    document.head.appendChild(script);
  }).then(async (google: any) => {
    // Ensure maps and places are loaded via importLibrary
    await google.maps.importLibrary("maps");
    await google.maps.importLibrary("places");
    return google;
  });

  return googlePromise;
}

