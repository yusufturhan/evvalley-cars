// User status calculation utilities
export function calculateMembershipDuration(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffInMs = now.getTime() - created.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return "Bugün üye oldu";
  } else if (diffInDays === 1) {
    return "1 gündür üye";
  } else if (diffInDays < 7) {
    return `${diffInDays} gündür üye`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} haftadır üye`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} aydır üye`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} yıldır üye`;
  }
}

export function isVerifiedUser(email: string): boolean {
  // Email doğrulandı kabul ediyoruz (Clerk ile giriş yapanlar)
  return email && email.includes('@');
}

export function getVerificationBadge(): string {
  return "Doğrulanmış";
}

export function formatListingCount(count: number): string {
  if (count === 0) {
    return "Henüz ilan yok";
  } else if (count === 1) {
    return "1 ilan";
  } else {
    return `${count} ilan`;
  }
} 