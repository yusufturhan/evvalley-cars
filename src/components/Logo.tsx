import Image from 'next/image';
import { Zap } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo.svg"
        alt="Evvalley"
        width={size === 'sm' ? 80 : size === 'lg' ? 160 : 120}
        height={size === 'sm' ? 27 : size === 'lg' ? 53 : 40}
        className="rounded-lg"
      />
    </div>
  );
}

// Alternative version with actual logo image
export function LogoWithImage({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo.svg"
        alt="Evvalley"
        width={size === 'sm' ? 80 : size === 'lg' ? 160 : 120}
        height={size === 'sm' ? 27 : size === 'lg' ? 53 : 40}
        className="rounded-lg"
      />
    </div>
  );
} 