import { LISTING_CREATE_PATH } from "./links";

export function getSellCtaHref(isSignedIn: boolean): string {
  return isSignedIn
    ? LISTING_CREATE_PATH
    : `/sign-in?redirect_url=${encodeURIComponent(LISTING_CREATE_PATH)}`;
}

