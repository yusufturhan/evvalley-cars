import Image from 'next/image';
import { Zap } from 'lucide-react';

// Inline SVG logo component
function LogoSVG({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <svg 
        width={size === 'sm' ? 80 : size === 'lg' ? 160 : 120} 
        height={size === 'sm' ? 27 : size === 'lg' ? 53 : 40} 
        viewBox="0 0 140 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="rounded-lg"
      >
        {/* Lightning bolt - large and prominent */}
        <path d="M8 4L2 20H14L6 36L20 20H10L18 4Z" fill="#1C1F4A" stroke="#1C1F4A" strokeWidth="2"/>
        
        {/* EVVALLEY text - large and readable */}
        <text x="30" y="25" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#1C1F4A">EVVALLEY</text>
      </svg>
    </div>
  );
}

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  // Use inline SVG for better reliability
  return <LogoSVG className={className} size={size} />;
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