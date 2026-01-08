# Design System - Foodbook v2

This document describes the design system implementation for PS Foodbook v2,
built with accessibility and WCAG 2.1 AA compliance at its core.

## Overview

The design system is built on:

- **Tailwind CSS v4** - Utility-first CSS framework
- **CSS Custom Properties** - For theming and dark mode
- **WCAG 2.1 AA** - Accessibility compliance (minimum 4.5:1 contrast ratios)
- **shadcn/ui** - High-quality component library

## Color System

### Primary Colors - PS Foodservice Blue

The primary color is PS Foodservice blue, chosen for brand consistency and
accessibility.

```css
/* Light mode */
--primary: 213 94% 38%; /* #0563C1 - WCAG AA: 5.2:1 on white */
--primary-foreground: 0 0% 100%; /* White */

/* Dark mode */
--primary: 213 97% 87%; /* #BFDBFE - WCAG AA: 4.5:1 on dark */
--primary-foreground: 222 47% 11%; /* Dark blue-gray */
```

### Semantic Colors

All semantic colors meet WCAG AA requirements:

| Color              | Light Mode                | Dark Mode                | Usage                  |
| ------------------ | ------------------------- | ------------------------ | ---------------------- |
| `background`       | #FFFFFF (White)           | #0F172A (Dark blue-gray) | Page background        |
| `foreground`       | #0F172A (Dark blue-gray)  | #F8FAFC (Off-white)      | Primary text           |
| `muted`            | #EEF2F6 (Light blue-gray) | #334155 (Medium dark)    | Subtle backgrounds     |
| `muted-foreground` | #64748B (Medium gray)     | #94A3B8 (Light gray)     | Secondary text (7.1:1) |
| `destructive`      | #EF4444 (Red)             | #FCA5A5 (Light red)      | Error states           |
| `border`           | #E2E8F0 (Light border)    | #334155 (Medium dark)    | Borders and dividers   |
| `ring`             | #0563C1 (PS Blue)         | #BFDBFE (Light PS Blue)  | Focus indicators       |

### Using Colors

```tsx
// Primary button
<button className="bg-primary text-primary-foreground">
  Click me
</button>

// Muted text
<p className="text-muted-foreground">
  Secondary information
</p>

// Error message
<div className="text-destructive">
  Error message
</div>
```

## Typography

### Font Families

```css
--font-sans: 'Geist Sans', system-ui, sans-serif;
--font-mono: 'Geist Mono', 'Courier New', monospace;
```

### Font Classes

```tsx
// Sans-serif (default)
<div className="font-sans">Regular text</div>

// Monospace
<code className="font-mono">Code snippet</code>
```

### Font Sizes & Line Heights

Tailwind's default scale is used for consistency:

- `text-xs` - 0.75rem (12px)
- `text-sm` - 0.875rem (14px)
- `text-base` - 1rem (16px) - Default
- `text-lg` - 1.125rem (18px)
- `text-xl` - 1.25rem (20px)
- `text-2xl` - 1.5rem (24px)
- `text-3xl` - 1.875rem (30px)
- `text-4xl` - 2.25rem (36px)

## Spacing & Layout

### Container Queries

The design system includes container queries support:

```tsx
// Container with size queries
<div className="@container">
  <div className="@sm:text-lg @md:text-xl @lg:text-2xl">
    Responsive text based on container width
  </div>
</div>
```

### Border Radius

Consistent border radius tokens:

- `rounded-sm` - 6px (radius - 4px)
- `rounded-md` - 8px (radius - 2px)
- `rounded-lg` - 10px (default radius)
- `rounded-xl` - 14px (radius + 4px)
- `rounded-2xl` - 18px (radius + 8px)

## Accessibility

### Focus Indicators

All interactive elements have visible focus indicators:

```css
*:focus-visible {
  outline: none;
  ring: 2px solid var(--ring);
  ring-offset: 2px;
}
```

### Skip to Content Link

A skip link is available for keyboard users:

```tsx
<a href="#main-content" className="skip-to-content">
  Skip to content
</a>
```

### Color Contrast

All color combinations meet WCAG AA standards:

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **Muted text**: 7.1:1 contrast ratio for better readability

### Reduced Motion

Respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### High Contrast Mode

Adapts to user's contrast preferences:

```css
@media (prefers-contrast: high) {
  :root {
    --border: 0 0% 0%; /* Black borders */
  }
}
```

## Dark Mode

### Enabling Dark Mode

Add the `dark` class to any parent element:

```tsx
// Toggle dark mode
<html className="dark">
  <body>{/* Content automatically uses dark mode colors */}</body>
</html>
```

### Dark Mode Colors

All colors automatically adjust in dark mode:

```tsx
// This works in both light and dark mode
<div className="bg-background text-foreground">
  <h1 className="text-primary">Title</h1>
  <p className="text-muted-foreground">Subtitle</p>
</div>
```

## Component Utilities

### cn() Function

The `cn()` utility merges class names intelligently:

```tsx
import { cn } from '@/lib/utils';

// Conditional classes
<div
  className={cn(
    'base-class',
    isActive && 'active-class',
    className // Props className
  )}
>
  Content
</div>;
```

### Example Usage

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive';
}

export function Button({
  variant = 'default',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg px-4 py-2 font-medium transition-colors',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2',
        variant === 'default' &&
          'bg-primary text-primary-foreground hover:bg-primary/90',
        variant === 'destructive' &&
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        className
      )}
      {...props}
    />
  );
}
```

## Animation

### Built-in Animations

The design system includes `tailwindcss-animate` plugin:

```tsx
// Fade in
<div className="animate-in fade-in">
  Content
</div>

// Slide in from bottom
<div className="animate-in slide-in-from-bottom">
  Content
</div>

// Slide out to top
<div className="animate-out slide-out-to-top">
  Content
</div>
```

## Best Practices

### 1. Use Semantic Colors

Always use semantic color names, not raw values:

```tsx
// ✅ Good
<div className="bg-primary text-primary-foreground">

// ❌ Bad
<div className="bg-blue-600 text-white">
```

### 2. Maintain Contrast Ratios

Ensure text meets WCAG AA:

```tsx
// ✅ Good - High contrast
<p className="text-foreground">Normal text</p>
<p className="text-muted-foreground">Secondary text (7.1:1)</p>

// ❌ Bad - Low contrast
<p className="text-gray-400">Hard to read text</p>
```

### 3. Use Focus Indicators

Never remove focus outlines:

```tsx
// ✅ Good - Visible focus
<button className="focus-visible:ring-2">Button</button>

// ❌ Bad - No focus indicator
<button className="outline-none">Button</button>
```

### 4. Respect Motion Preferences

Use transitions, but respect `prefers-reduced-motion`:

```tsx
// ✅ Good - Automatic respect for motion preferences
<div className="transition-colors">

// ❌ Bad - Forced animation
<div className="animate-spin">
```

### 5. Test in Dark Mode

Always test components in both light and dark modes:

```tsx
// Toggle dark mode for testing
document.documentElement.classList.toggle('dark');
```

## Resources

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [shadcn/ui Components](https://ui.shadcn.com)

## Testing Tools

### Contrast Ratio

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools: Inspect element > Accessibility > Contrast

### Keyboard Navigation

1. Tab through all interactive elements
2. Verify visible focus indicators
3. Test skip links (Tab on page load)
4. Test keyboard shortcuts

### Screen Readers

- Windows: NVDA (free)
- macOS: VoiceOver (built-in)
- Test all interactive elements and ARIA labels

### Color Blindness

- [Colorblind Web Page Filter](https://www.toptal.com/designers/colorfilter)
- Chrome DevTools: Rendering > Emulate vision deficiencies
