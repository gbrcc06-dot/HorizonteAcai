# Design Guidelines: Horizonte - Sorvete e Açaí

## Design Approach
**Reference-Based**: Drawing inspiration from premium food delivery platforms (Uber Eats, Rappi, iFood) combined with the vibrant, indulgent aesthetic of dessert brands. Elevated beyond the reference site with modern gradients, glass morphism effects, and premium visual treatment.

## Core Design Elements

### Typography
- **Headings**: Modern sans-serif, bold weights (700-800) for category titles and product names
- **Body**: Clean sans-serif, regular (400) and medium (500) weights for descriptions and prices
- **Prices**: Bold, prominent display to emphasize value
- **Hierarchy**: Large product names (text-xl to text-2xl), medium category headers (text-3xl), smaller descriptions (text-sm)

### Layout System
**Spacing**: Use Tailwind units of 4, 6, 8, and 12 for consistent rhythm (p-4, gap-6, my-8, py-12)
- Generous padding around sections (py-12 to py-16)
- Consistent gaps in product grids (gap-6)
- Breathing room around interactive elements (p-4 for cards)

### Visual Treatment

**Gradient Background**:
- Vibrant purple-to-gold gradient matching the Horizonte logo colors
- Diagonal or radial gradient creating depth (purple #8B5CF6 → gold #FBBF24)
- Subtle overlay pattern or noise texture for richness
- Fixed background prevents jarring scrolling

**Button Style - Shiny/Glow Effects**:
- Glass morphism: semi-transparent white background with backdrop blur
- Bright border glow using box-shadow (0 0 20px rgba(251, 191, 36, 0.6))
- Gradient overlay on hover for interactive feedback
- Pill-shaped (fully rounded) for primary CTAs
- Multiple shadow layers for depth perception

### Component Library

**Header**:
- Logo "Horizonte" centered or left-aligned, medium size (h-16 to h-20)
- Store status badge with green dot (Loja Aberta) and hours
- Search bar with frosted glass effect, prominent placement
- Floating/sticky on scroll for accessibility

**Product Cards**:
- White/frosted glass cards with subtle shadow and border
- Product image at top (square or 4:3 ratio)
- Product name bold and prominent
- Price in large, contrasting text with currency symbol
- Quick add button with glow effect
- Hover state: slight lift (transform scale) and enhanced glow

**Category Sections**:
- Clear category headers with decorative elements
- Horizontal scroll for promotions carousel
- Grid layout: 2 columns mobile, 3-4 columns desktop
- Visual separators between categories

**Product Detail Modal/Page**:
- Large hero image of product
- Size selector as prominent pill buttons
- Free toppings section with checkbox grid (23+ options!)
- Quantity stepper with + / - buttons
- Sticky add to cart button at bottom
- Total price updates live

**Shopping Cart**:
- Floating cart icon with item count badge
- Slide-in drawer from right with glass effect
- Line items with mini thumbnails
- Subtotal, delivery fee, total breakdown
- Checkout button with maximum glow effect

**Navigation**:
- Category quick-jump menu (sticky horizontal scroll)
- Search with auto-suggest dropdown
- Filter chips for dietary preferences if applicable

### Images
- **Hero Section**: Large banner featuring colorful açaí bowls and ice cream with tropical fruits, warm lighting, appetizing composition (full-width, h-64 to h-80)
- **Product Images**: High-quality photos of each item on clean backgrounds, showing toppings and portions clearly
- **Category Headers**: Small decorative icons or illustrations for each category
- **Promotional Banners**: Eye-catching graphics for deals and featured items

### Special Effects
**Minimal Animations**:
- Smooth scroll behavior for category navigation
- Gentle fade-in for product cards on scroll
- Cart icon pulse when item added
- Button shine sweep effect (no complex animations)

### Color Accents
- Use gold (#FBBF24) for prices, badges, and highlights
- Purple (#8B5CF6) for secondary elements and icons
- White/frosted glass for cards and containers
- Dark text (#1F2937) on light surfaces for readability

### Responsive Behavior
- **Mobile**: Single column product grid, collapsible categories, bottom nav bar
- **Tablet**: 2-3 column grid, side cart drawer
- **Desktop**: 3-4 column grid, persistent cart sidebar option, larger hero

### Brazilian Market Considerations
- Prices in R$ (Reais) formatted as "R$ 10,00"
- WhatsApp integration button (prominent)
- Delivery area selector/checker
- Payment method icons (Pix, card, cash)
- Language: Brazilian Portuguese throughout