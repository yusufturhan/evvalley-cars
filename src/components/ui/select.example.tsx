/**
 * Select Component Usage Examples
 * 
 * This file demonstrates how to use the Select component.
 * Delete this file after reviewing the examples.
 */

import { Select } from "./select";

// Example 1: Basic Select
export function BasicSelectExample() {
  return (
    <div className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Select a Vehicle Type
        </label>
        <Select>
          <option value="">Choose a type</option>
          <option value="ev-car">Electric Car</option>
          <option value="hybrid-car">Hybrid Car</option>
          <option value="ev-scooter">Electric Scooter</option>
          <option value="e-bike">E-Bike</option>
        </Select>
      </div>
    </div>
  );
}

// Example 2: With Default Value
export function WithDefaultValueExample() {
  return (
    <div className="max-w-md">
      <label className="block text-sm font-medium text-foreground mb-2">
        Select Brand
      </label>
      <Select defaultValue="tesla">
        <option value="all">All Brands</option>
        <option value="tesla">Tesla</option>
        <option value="rivian">Rivian</option>
        <option value="lucid">Lucid</option>
        <option value="ford">Ford</option>
        <option value="chevrolet">Chevrolet</option>
      </Select>
    </div>
  );
}

// Example 3: Disabled State
export function DisabledExample() {
  return (
    <div className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Disabled Select
        </label>
        <Select disabled>
          <option value="">Not available</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </Select>
      </div>
    </div>
  );
}

// Example 4: Multiple Selects in a Form
export function FormExample() {
  return (
    <div className="max-w-2xl p-6 bg-card border border-border rounded-xl space-y-6">
      <h2 className="text-2xl font-semibold text-card-foreground">
        Filter Vehicles
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Category
          </label>
          <Select>
            <option value="all">All Categories</option>
            <option value="ev-car">Electric Cars</option>
            <option value="hybrid-car">Hybrid Cars</option>
            <option value="ev-scooter">Electric Scooters</option>
            <option value="e-bike">Electric Bikes</option>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Brand
          </label>
          <Select>
            <option value="all">All Brands</option>
            <option value="tesla">Tesla</option>
            <option value="rivian">Rivian</option>
            <option value="lucid">Lucid</option>
            <option value="ford">Ford</option>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Year
          </label>
          <Select>
            <option value="all">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Price Range
          </label>
          <Select>
            <option value="all">All Prices</option>
            <option value="0-20000">Under $20,000</option>
            <option value="20000-40000">$20,000 - $40,000</option>
            <option value="40000-60000">$40,000 - $60,000</option>
            <option value="60000+">Over $60,000</option>
          </Select>
        </div>
      </div>
    </div>
  );
}

// Example 5: Controlled Select with State
export function ControlledExample() {
  // In a real component:
  // const [value, setValue] = React.useState("tesla");
  
  return (
    <div className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Controlled Select
        </label>
        <Select
          value="tesla"
          onChange={(e) => console.log("Selected:", e.target.value)}
        >
          <option value="tesla">Tesla</option>
          <option value="rivian">Rivian</option>
          <option value="lucid">Lucid</option>
        </Select>
      </div>
      <p className="text-sm text-muted-foreground">
        Check console for onChange events
      </p>
    </div>
  );
}

// Example 6: Custom Width
export function CustomWidthExample() {
  return (
    <div className="space-y-4">
      <div className="max-w-xs">
        <label className="block text-sm font-medium text-foreground mb-2">
          Small Width (max-w-xs)
        </label>
        <Select>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </Select>
      </div>
      
      <div className="max-w-md">
        <label className="block text-sm font-medium text-foreground mb-2">
          Medium Width (max-w-md)
        </label>
        <Select>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </Select>
      </div>
      
      <div className="max-w-lg">
        <label className="block text-sm font-medium text-foreground mb-2">
          Large Width (max-w-lg)
        </label>
        <Select>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </Select>
      </div>
    </div>
  );
}

// Example 7: With Option Groups
export function WithOptGroupExample() {
  return (
    <div className="max-w-md">
      <label className="block text-sm font-medium text-foreground mb-2">
        Select Vehicle
      </label>
      <Select>
        <option value="">Choose a vehicle</option>
        <optgroup label="Electric Cars">
          <option value="tesla-model-3">Tesla Model 3</option>
          <option value="tesla-model-y">Tesla Model Y</option>
          <option value="rivian-r1t">Rivian R1T</option>
          <option value="lucid-air">Lucid Air</option>
        </optgroup>
        <optgroup label="Hybrid Cars">
          <option value="toyota-prius">Toyota Prius</option>
          <option value="honda-accord-hybrid">Honda Accord Hybrid</option>
          <option value="ford-escape-hybrid">Ford Escape Hybrid</option>
        </optgroup>
        <optgroup label="E-Bikes">
          <option value="rad-power">Rad Power Bikes</option>
          <option value="specialized">Specialized Turbo</option>
        </optgroup>
      </Select>
    </div>
  );
}

// Example 8: Real-World Filter Bar
export function FilterBarExample() {
  return (
    <div className="bg-muted p-4 rounded-lg border border-border">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-foreground mb-2">
            Category
          </label>
          <Select>
            <option value="all">All Vehicles</option>
            <option value="ev-car">Electric Cars</option>
            <option value="hybrid-car">Hybrid Cars</option>
          </Select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-foreground mb-2">
            Brand
          </label>
          <Select>
            <option value="all">All Brands</option>
            <option value="tesla">Tesla</option>
            <option value="rivian">Rivian</option>
          </Select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-foreground mb-2">
            Year
          </label>
          <Select>
            <option value="all">All Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </Select>
        </div>
      </div>
    </div>
  );
}

// Example 9: Required Field
export function RequiredExample() {
  return (
    <div className="max-w-md">
      <label className="block text-sm font-medium text-foreground mb-2">
        Vehicle Type <span className="text-red-500">*</span>
      </label>
      <Select required>
        <option value="">Please select</option>
        <option value="ev-car">Electric Car</option>
        <option value="hybrid-car">Hybrid Car</option>
        <option value="ev-scooter">Electric Scooter</option>
      </Select>
      <p className="text-xs text-muted-foreground mt-1">
        This field is required
      </p>
    </div>
  );
}

// Example 10: With Custom Styling
export function CustomStylingExample() {
  return (
    <div className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Custom Border Color
        </label>
        <Select className="border-primary">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Custom Background
        </label>
        <Select className="bg-muted">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </Select>
      </div>
    </div>
  );
}

