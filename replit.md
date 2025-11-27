# Horizonte - Sorvete e Açaí

## Overview

Horizonte is a premium food delivery web application for an ice cream and açaí shop. The application provides an elegant, visually-rich ordering experience with a vibrant purple-to-gold gradient aesthetic inspired by premium food delivery platforms like Uber Eats, Rappi, and iFood. Customers can browse products by category, customize their orders with toppings and sizes, and manage their shopping cart before checkout.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 18 with TypeScript
- **Routing:** Wouter (lightweight client-side routing)
- **State Management:** TanStack Query (React Query) v5 for server state
- **UI Framework:** Shadcn/ui component library with Radix UI primitives
- **Styling:** Tailwind CSS with custom design tokens

**Design Philosophy:**
The application follows a reference-based design approach, drawing inspiration from premium food delivery platforms but elevated with custom visual treatments including glass morphism effects, gradient backgrounds (purple #8B5CF6 → gold #FBBF24), and shiny/glow button effects. The design emphasizes generous spacing, modern typography (Poppins/Inter fonts), and visual hierarchy.

**Component Structure:**
- Modular component architecture with separation of UI components (`/components/ui/`) and feature components
- Key feature components: `StoreHeader`, `CategoryNav`, `CategorySection`, `ProductCard`, `ProductModal`, `CartDrawer`, `StoreFooter`
- Loading states handled with skeleton components
- Responsive design with mobile-first approach

**State Management Rationale:**
TanStack Query was chosen for its powerful server state management capabilities, built-in caching, automatic refetching, and optimistic updates. This eliminates the need for additional global state management while providing excellent developer experience with minimal boilerplate.

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with Express.js
- **Database ORM:** Drizzle ORM
- **Database:** PostgreSQL (via Neon serverless)
- **Build Tool:** Vite for frontend, esbuild for server bundling
- **Development:** TSX for TypeScript execution

**API Design:**
RESTful API architecture with the following endpoints:
- `GET /api/categories` - Fetch all product categories
- `GET /api/products` - Fetch all products (with optional category filter)
- `GET /api/products/:id` - Fetch single product details
- `GET /api/cart` - Fetch cart items
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:id` - Remove item from cart

**Storage Layer:**
The application currently uses an in-memory storage implementation (`MemStorage`) that mimics database operations. This allows for rapid development and testing without database dependencies. The storage layer is abstracted through an `IStorage` interface, making it trivial to swap to a persistent database implementation (Drizzle ORM with PostgreSQL) without changing business logic.

**Server Configuration:**
- Custom middleware for request logging with duration tracking
- JSON body parsing with raw body preservation (for webhook verification)
- Static file serving for production builds
- Development mode includes Vite HMR integration

### Data Storage Solutions

**Database Schema (Drizzle ORM):**

The schema is defined in `shared/schema.ts` using Drizzle ORM's PostgreSQL table definitions:

1. **Categories Table:**
   - Fields: id (varchar, PK), name (text), order (integer)
   - Purpose: Organize products into browsable sections
   - Sorted by order field for consistent display

2. **Products Table:**
   - Fields: id (varchar, PK), name, description, categoryId (FK), basePrice, image, isPromotion, isFeatured, sizes (text array), toppings (text array)
   - Purpose: Store product catalog with customization options
   - Supports promotional and featured product flags

3. **Cart Items Table:**
   - Fields: id (varchar, PK, auto-generated UUID), productId, productName, size, price, quantity, selectedToppings (text array)
   - Purpose: Track user shopping cart state
   - Denormalized design stores product name for cart stability

**Schema Design Rationale:**
The schema uses text arrays for sizes and toppings to provide flexibility for product customization without additional junction tables. This trade-off favors simplicity and read performance over normalization, appropriate for a catalog-focused application. The cart items table is denormalized to maintain cart integrity even if products are modified.

### External Dependencies

**UI Component Library:**
- **Radix UI** - Extensive collection of headless, accessible UI primitives (accordion, dialog, dropdown, popover, etc.)
- **shadcn/ui** - Pre-styled components built on Radix UI with Tailwind CSS
- Chosen for accessibility compliance, customizability, and professional appearance

**Development Tools:**
- **Vite** - Lightning-fast frontend build tool with HMR
- **esbuild** - High-performance server bundling
- **Replit-specific plugins** - Runtime error overlay, cartographer, dev banner for development experience

**Database Service:**
- **Neon Serverless PostgreSQL** - Cloud-native PostgreSQL with HTTP connectivity
- Provides instant provisioning, branching, and autoscaling
- Ideal for serverless deployment with connection pooling

**Key Dependency Allowlist:**
The build process selectively bundles certain server dependencies (listed in `script/build.ts`) to reduce syscalls and improve cold start times. This optimization is crucial for serverless deployment performance.

**Form Validation:**
- **Zod** - TypeScript-first schema validation
- **drizzle-zod** - Automatic Zod schema generation from Drizzle tables
- **@hookform/resolvers** - React Hook Form integration with Zod
- Ensures type-safe data validation across client and server

**Utility Libraries:**
- **class-variance-authority** - Type-safe component variants
- **clsx** + **tailwind-merge** - Efficient className composition
- **date-fns** - Modern date utility library
- **nanoid** - Compact unique ID generation