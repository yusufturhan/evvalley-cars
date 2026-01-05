/**
 * Card Component Usage Examples
 * 
 * This file demonstrates how to use the Card component system.
 * Delete this file after reviewing the examples.
 */

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";

// Example 1: Basic Card
export function BasicCardExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content area with design tokens applied automatically.</p>
      </CardContent>
      <CardFooter>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
          Action
        </button>
      </CardFooter>
    </Card>
  );
}

// Example 2: Card with Custom Classes
export function CustomCardExample() {
  return (
    <Card className="max-w-md hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Custom Styled Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          You can add custom classes without overriding design tokens.
        </p>
      </CardContent>
    </Card>
  );
}

// Example 3: Card without Footer
export function SimpleCardExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Cards are composable - use only the parts you need.</p>
      </CardContent>
    </Card>
  );
}

// Example 4: Grid of Cards
export function CardGridExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Card 1</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">First card in grid</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Card 2</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Second card in grid</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Card 3</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Third card in grid</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Example 5: Card with Complex Content
export function ComplexCardExample() {
  return (
    <Card className="max-w-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Vehicle Details</CardTitle>
            <CardDescription>2024 Tesla Model 3</CardDescription>
          </div>
          <span className="text-2xl font-bold text-primary">$45,000</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Mileage</p>
            <p className="text-lg font-semibold">12,000 mi</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Year</p>
            <p className="text-lg font-semibold">2024</p>
          </div>
        </div>
        <p className="text-sm">
          Excellent condition, fully loaded with autopilot features.
        </p>
      </CardContent>
      <CardFooter className="flex gap-4">
        <button className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90">
          Contact Seller
        </button>
        <button className="flex-1 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-muted">
          Save
        </button>
      </CardFooter>
    </Card>
  );
}

