# Design Token System

This project uses a CSS-first design token system with Tailwind v4.

## Available Tailwind Utilities

### Background Colors
- `bg-background` - Page background
- `bg-muted` - Subtle background for cards/sections
- `bg-card` - Card background
- `bg-primary` - Brand primary blue
- `bg-secondary` - Secondary gray

### Text Colors
- `text-foreground` - Primary text color
- `text-muted-foreground` - Muted/secondary text
- `text-card-foreground` - Text on cards
- `text-primary-foreground` - Text on primary background (white)
- `text-secondary-foreground` - Text on secondary background

### Borders & Rings
- `border-border` - Standard border color
- `border-input` - Input field border
- `ring-ring` - Focus ring color

## Usage Examples

### Card Component
```tsx
<div className="bg-card text-card-foreground border border-border rounded-lg p-6">
  <h2 className="text-lg font-semibold">Card Title</h2>
  <p className="text-muted-foreground">Card description</p>
</div>
```

### Primary Button
```tsx
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90">
  Click Me
</button>
```

### Input Field
```tsx
<input 
  className="border-input bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring"
  placeholder="Enter text..."
/>
```

### Muted Section
```tsx
<section className="bg-muted p-8">
  <h3 className="text-foreground">Section Title</h3>
  <p className="text-muted-foreground">Secondary information</p>
</section>
```

## Dark Mode Support

Dark mode is ready via the `.dark` class on the root element:

```html
<html className="dark">
  <!-- All tokens automatically switch to dark variants -->
</html>
```

To implement dark mode toggle:
```tsx
const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark');
};
```

## Color Format: OKLCH

All colors use OKLCH for:
- ✅ Better perceptual uniformity
- ✅ Reliable WCAG contrast ratios
- ✅ Native browser support

Format: `oklch(lightness chroma hue)`
- **Lightness**: 0-1 (0=black, 1=white)
- **Chroma**: Color intensity (0=gray)
- **Hue**: Color angle (0-360)

## Token Values

### Light Mode
- `--background`: `#ffffff`
- `--foreground`: `#171717`
- `--muted`: `oklch(0.96 0.002 264)` - Light gray
- `--muted-foreground`: `oklch(0.55 0.015 264)` - Medium gray
- `--primary`: `oklch(0.70 0.15 240)` - Brand blue (#3AB0FF equivalent)
- `--border`: `oklch(0.89 0.005 264)` - Neutral border

### Dark Mode (`.dark`)
- `--background`: `oklch(0.10 0.01 264)` - Very dark
- `--foreground`: `oklch(0.95 0.005 264)` - Near white
- `--muted`: `oklch(0.18 0.01 264)` - Dark gray
- `--card`: `oklch(0.13 0.01 264)` - Card background

## Migration from Hardcoded Colors

### Before
```tsx
<div className="bg-white text-gray-900 border border-gray-200">
  <button className="bg-blue-600 text-white">Click</button>
</div>
```

### After
```tsx
<div className="bg-card text-card-foreground border border-border">
  <button className="bg-primary text-primary-foreground">Click</button>
</div>
```

Benefits:
- ✅ Consistent across the app
- ✅ Dark mode ready
- ✅ Easier to rebrand
- ✅ Better accessibility

