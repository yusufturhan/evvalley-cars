/**
 * Button Component Usage Examples
 * 
 * This file demonstrates how to use the Button component.
 * Delete this file after reviewing the examples.
 */

import { Button } from "./button";

// Example 1: Button Variants
export function VariantsExample() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  );
}

// Example 2: Button Sizes
export function SizesExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium (Default)</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

// Example 3: Disabled States
export function DisabledExample() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button disabled>Disabled Primary</Button>
      <Button variant="secondary" disabled>
        Disabled Secondary
      </Button>
      <Button variant="outline" disabled>
        Disabled Outline
      </Button>
    </div>
  );
}

// Example 4: With Icons (using lucide-react)
export function WithIconsExample() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button>
        <span className="mr-2">🚗</span>
        View Details
      </Button>
      <Button variant="secondary">
        <span className="mr-2">💬</span>
        Chat
      </Button>
      <Button variant="outline">
        <span className="mr-2">❤️</span>
        Favorite
      </Button>
    </div>
  );
}

// Example 5: All Sizes with All Variants
export function ComprehensiveExample() {
  const variants = ["primary", "secondary", "outline", "ghost"] as const;
  const sizes = ["sm", "md", "lg"] as const;

  return (
    <div className="space-y-8">
      {variants.map((variant) => (
        <div key={variant} className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground capitalize">
            {variant}
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            {sizes.map((size) => (
              <Button key={size} variant={variant} size={size}>
                {size.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Example 6: Real-World Usage (Vehicle Card Actions)
export function RealWorldExample() {
  return (
    <div className="flex flex-col gap-4 max-w-md p-6 bg-card rounded-xl border border-border">
      <h2 className="text-xl font-semibold">2024 Tesla Model 3</h2>
      <p className="text-muted-foreground">
        Long Range AWD, 15,000 miles, Excellent condition
      </p>
      <div className="text-2xl font-bold text-primary">$45,990</div>
      
      <div className="flex gap-3 mt-4">
        <Button className="flex-1" size="lg">
          Contact Seller
        </Button>
        <Button variant="outline" size="lg">
          💬 Chat
        </Button>
      </div>
      
      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1">
          Save for Later
        </Button>
        <Button variant="ghost">Share</Button>
      </div>
    </div>
  );
}

// Example 7: Loading State (Custom)
export function LoadingExample() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button disabled>
        <span className="mr-2 animate-spin">⏳</span>
        Processing...
      </Button>
      <Button variant="secondary" disabled>
        <span className="mr-2 animate-spin">⏳</span>
        Loading...
      </Button>
    </div>
  );
}

// Example 8: Full-Width Button
export function FullWidthExample() {
  return (
    <div className="max-w-md space-y-3">
      <Button className="w-full">Full Width Primary</Button>
      <Button variant="secondary" className="w-full">
        Full Width Secondary
      </Button>
      <Button variant="outline" className="w-full">
        Full Width Outline
      </Button>
    </div>
  );
}

// Example 9: Button Group
export function ButtonGroupExample() {
  return (
    <div className="inline-flex rounded-lg border border-border overflow-hidden">
      <Button variant="ghost" size="sm" className="rounded-none border-r border-border">
        Left
      </Button>
      <Button variant="ghost" size="sm" className="rounded-none border-r border-border">
        Center
      </Button>
      <Button variant="ghost" size="sm" className="rounded-none">
        Right
      </Button>
    </div>
  );
}

// Example 10: As Link (using Next.js Link wrapper pattern)
export function AsLinkExample() {
  // In real usage:
  // <Link href="/vehicles">
  //   <Button variant="outline">View All Vehicles</Button>
  // </Link>
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Wrap Button in Next.js Link component for navigation:
      </p>
      <Button variant="outline">View All Vehicles</Button>
    </div>
  );
}
