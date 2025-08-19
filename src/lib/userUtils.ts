// User status calculation utilities
export function calculateMembershipDuration(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffInMs = now.getTime() - created.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return "Joined today";
  } else if (diffInDays === 1) {
    return "Member for 1 day";
  } else if (diffInDays < 7) {
    return `Member for ${diffInDays} days`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `Member for ${weeks} weeks`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `Member for ${months} months`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `Member for ${years} years`;
  }
}

export function isVerifiedUser(email: string): boolean {
  // Consider email verified (users who sign in with Clerk)
  return Boolean(email && email.includes('@'));
}

export function getVerificationBadge(): string {
  return "Verified";
}

export function formatListingCount(count: number): string {
  if (count === 0) {
    return "No listings yet";
  } else if (count === 1) {
    return "1 listing";
  } else {
    return `${count} listings`;
  }
} 