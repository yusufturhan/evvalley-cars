import Image from 'next/image';
import { Car } from 'lucide-react';

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
      {/* Replace this with your actual logo */}
      <div className={`${sizeClasses[size]} bg-blue-600 rounded-lg flex items-center justify-center`}>
        <Car className="h-5 w-5 text-white" />
      </div>
      <span className="ml-2 text-xl font-bold text-gray-900">Evvalley Motors</span>
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
      {/* Uncomment and replace with your actual logo */}
      {/* <Image
        src="/logo.png"
        alt="Evvalley Motors"
        width={32}
        height={32}
        className={sizeClasses[size]}
      /> */}
      <div className={`${sizeClasses[size]} bg-blue-600 rounded-lg flex items-center justify-center`}>
        <Car className="h-5 w-5 text-white" />
      </div>
      <span className="ml-2 text-xl font-bold text-gray-900">Evvalley Motors</span>
    </div>
  );
} 