// User status calculation utilities
export function calculateMembershipDuration(createdAt: string): string {
  if (!createdAt) {
    return "unknown time";
  }

  const created = new Date(createdAt);
  const now = new Date();
  
  // Check if the date is valid
  if (isNaN(created.getTime())) {
    return "unknown time";
  }
  
  const diffInMs = now.getTime() - created.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  // Handle future dates (shouldn't happen but just in case)
  if (diffInDays < 0) {
    return "recently";
  }
  
  if (diffInDays === 0) {
    return "today";
  } else if (diffInDays === 1) {
    return "1 day";
  } else if (diffInDays < 7) {
    return `${diffInDays} days`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    const remainingDays = diffInDays % 7;
    if (remainingDays === 0) {
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    } else {
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} and ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`;
    }
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    const remainingDays = diffInDays % 30;
    if (remainingDays === 0) {
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      return `${months} ${months === 1 ? 'month' : 'months'} and ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`;
    }
  } else {
    const years = Math.floor(diffInDays / 365);
    const remainingDays = diffInDays % 365;
    if (remainingDays === 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    } else {
      return `${years} ${years === 1 ? 'year' : 'years'} and ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`;
    }
  }
}

export function calculateSellingDuration(firstListingDate: string): string {
  if (!firstListingDate) {
    return "Member for unknown time";
  }
  
  const duration = calculateMembershipDuration(firstListingDate);
  return `Selling for ${duration}`;
}

export function calculateMemberDuration(createdAt: string): string {
  if (!createdAt) {
    return "Member for unknown time";
  }
  
  const duration = calculateMembershipDuration(createdAt);
  return `Member for ${duration}`;
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