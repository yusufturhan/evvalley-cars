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
    // Already loaded
    if ((window as any).google?.maps?.importLibrary) {
      resolve((window as any).google);
      return;
    }

    // Reuse existing script if present
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-google-maps-loader="true"]'
    );
    if (existing) {
      existing.addEventListener("load", () => {
        if ((window as any).google?.maps?.importLibrary) {
          resolve((window as any).google);
        } else {
          reject(new Error("Google Maps failed to load importLibrary (existing script)"));
        }
      });
      existing.addEventListener("error", (err) => {
        reject(new Error("Google Maps script failed to load (existing script)"));
      });
      return;
    }

    const src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=places&loading=async`;
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsLoader = "true";
    script.onerror = (err) => {
      console.error("[MapsLoader] Script failed to load", { src, err });
      reject(new Error("Google Maps script failed to load"));
    };
    script.onload = () => {
      if (!(window as any).google?.maps?.importLibrary) {
        console.error("[MapsLoader] importLibrary missing after load", { src });
        reject(new Error("Google Maps failed to expose importLibrary"));
        return;
      }
      resolve((window as any).google);
    };
    document.head.appendChild(script);
  }).then(async (google: any) => {
    // Ensure maps and places are loaded via importLibrary, with diagnostics
    try {
      await google.maps.importLibrary("maps");
      await google.maps.importLibrary("places");
      return google;
    } catch (error: any) {
      const msg = String(error?.message || error);
      const commonHints: Record<string, string> = {
        RefererNotAllowedMapError:
          "Check allowed referrers in Google Cloud Console. Add https://www.evvalley.com/*",
        ApiNotActivatedMapError:
          "Enable Maps JavaScript API & Places API in Google Cloud Console",
        BillingNotEnabledMapError:
          "Enable billing on the Google Cloud project for Maps/Places",
        InvalidKeyMapError:
          "Check NEXT_PUBLIC_GOOGLE_MAPS_API_KEY validity and restrictions",
      };
      const hint = Object.entries(commonHints).find(([k]) => msg.includes(k));
      console.error("[MapsLoader] importLibrary failed", {
        error,
        message: msg,
        hint: hint ? hint[1] : "Check Google Maps API configuration and referrers",
      });
      throw error;
    }
  });

  return googlePromise;
}

