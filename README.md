# VIBE BITES - E-commerce Frontend

A fully responsive, branded e-commerce frontend for VIBE BITES healthy snacks, built with Next.js and Tailwind CSS.

## 🎯 Features

### ✅ Core E-commerce Functionality
- **Shopping Cart System** - Add, remove, update quantities with local storage persistence
- **Product Variants** - Multiple pack sizes (50g, 100g, 200g) with dynamic pricing
- **Video Upload & Display** - Optional product videos with play button overlay on product cards
- **Coupon System** - VIBE10 (10% off) and MAKHANA20 (20% off makhana products)
- **Product Filtering** - By category, price range, and search functionality
- **Responsive Design** - Mobile-first approach with full responsive layout

### ✅ Pages & Routing
- **Homepage** (`/`) - Hero section, categories, featured products, testimonials
- **Products Page** (`/products`) - Grid/list view with filtering and search
- **Product Detail** (`/product/[id]`) - Individual product with size selection and optional video display
- **Cart Page** (`/cart`) - Cart management with quantity controls
- **About Page** (`/about`) - Brand story and company information
- **Contact Page** (`/contact`) - Contact form and company details
- **Track Order** (`/track-order`) - Order tracking with cancel/return request functionality and product reviews
- **Profile** (`/profile`) - User profile with order history and submitted reviews

### ✅ Brand Identity
- **Custom Color Palette**: 
  - Background: `#FFF4E0`
  - Primary Brown: `#5A3B1C`
  - Cookie Accent: `#D9A25F`
- **Typography**: Poppins font family
- **Consistent Branding**: Logo placement in header and footer

## 🛠 Technical Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 3.3.2
- **Icons**: Lucide React
- **State Management**: React Context for cart
- **Images**: Next.js Image optimization
- **Fonts**: Google Fonts (Poppins)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Vibe_Bites/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
client/
├── app/                    # Next.js App Router pages
│   ├── page.js            # Homepage
│   ├── products/          # Products listing
│   ├── product/[id]/      # Product detail pages
│   ├── cart/              # Shopping cart
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── layout.js          # Root layout
├── components/            # Reusable components
│   ├── Navbar.js         # Navigation header
│   ├── Footer.js         # Footer component
│   ├── ProductCard.js    # Product display card
│   ├── CartContext.js    # Shopping cart context
│   └── ...
├── context/              # React contexts
│   └── CartContext.js    # Cart state management
├── data/                 # Static data
│   └── products.js       # Product data with variants
├── public/               # Static assets
│   └── images/           # Product and brand images
└── tailwind.config.js    # Tailwind configuration
```

## 🐛 Recent Fixes

### Complete Product Editing System (Latest)
- **New Working Edit Product API**: Created completely new `/api/admin/products/edit/:id` endpoints for GET and PUT operations
- **New Edit Product Page**: Built from scratch with proper authentication, form handling, and error management
- **Fixed Product Page**: Resolved infinite loop issues and improved error handling for product display
- **Enhanced User Experience**: Better loading states, error messages, and form validation
- **No Infinite Loops**: Clean, stable code that properly handles all edge cases

### Category Management Fixes (Latest)
- **Fixed POST /api/categories 400 Error**: Resolved validation issues with empty optional fields
- **Fixed PUT /api/categories 404 Error**: Corrected client-side API calls to include category ID
- **Improved Form Handling**: Client-side payload preparation to avoid sending empty strings
- **Better Validation**: Server-side validation now properly handles optional fields
- **Enhanced Error Handling**: Better error messages, duplicate name detection, and helpful API usage hints

### Admin Dashboard Fixes (Latest)
- **Fixed Recent Orders Amount Display**: Corrected field mapping from `totalAmount` to `total`
- **Improved Order Status Display**: Added proper status colors and field mapping
- **Enhanced Data Selection**: Server now properly selects required order fields
- **Better Error Handling**: Added empty state and debugging for dashboard data

## 🎨 Brand Colors

The application uses a custom color palette defined in `tailwind.config.js`:

```javascript
colors: {
  'vibe-bg': '#FFF4E0',      // Background color
  'vibe-brown': '#5A3B1C',   // Primary brown
  'vibe-cookie': '#D9A25F',  // Cookie accent
  'vibe-accent': '#8B4513',  // Darker accent
}
```

## 🎥 Video Upload & Display Features

### Video Functionality
- **Optional Video Upload** - Admins can add product videos during creation/editing
- **Product Card Integration** - Play button overlay on product cards when video is available
- **Video Modal** - Full-screen video playback with controls on product detail page
- **Auto-play Support** - Videos can autoplay on hover (muted) for better UX
- **Error Handling** - Graceful fallback to image if video fails to load
- **Responsive Design** - Video displays work seamlessly across all device sizes

### Video Implementation
- **Admin Forms** - Video URL input field in both create and edit product forms
- **Database Schema** - Optional `video` field in Product model
- **Frontend Display** - Interactive video player with play/pause controls
- **Performance Optimized** - Videos load only when user interacts with them
- **Clean Implementation** - Removed YouTube video integration for streamlined video experience

## ⭐ Review System Features

### Review Display
- **Product Reviews** - Customer reviews displayed on product detail pages
- **Rating Summary** - Average rating and review count on product cards
- **Review Cards** - Individual review display with ratings, titles, and comments
- **User Reviews** - Users can view their submitted reviews in profile page
- **Review Status** - Shows if reviews are published or pending approval

### Review Submission
- **Order-based Reviews** - Users can review products after delivery
- **Rating System** - 5-star rating system with visual feedback
- **Review Form** - Title and comment fields for detailed feedback
- **Verified Reviews** - Reviews linked to actual orders for authenticity

## 🛒 Shopping Cart Features

### Cart Functionality
- Add products with size selection
- Update quantities
- Remove items
- Local storage persistence
- Cart count badge in navbar

### Coupon System
- **VIBE10**: 10% discount on all products
- **MAKHANA20**: 20% discount on makhana category products
- Real-time discount calculation
- Category-specific discounts

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface
- Optimized for all device sizes

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📄 Pages Overview

### Homepage (`/`)
- Hero section with "Vibe Every Bite" tagline
- Category showcase
- Featured products grid
- Why choose us section
- Customer testimonials

### Products (`/products`)
- Product grid/list view toggle
- Advanced filtering (category, price)
- Search functionality
- Product cards with size selection

### Product Detail (`/product/[id]`)
- Large product image with optional video display
- Video modal with full-screen playback
- Size selection with pricing
- Quantity controls
- Add to cart functionality
- Nutrition facts and ingredients

### Cart (`/cart`)
- Cart items with quantity controls
- Coupon application
- Order summary with discounts
- Checkout button

### About (`/about`)
- Brand story and mission
- Company values
- Team section
- Impact statistics

### Contact (`/contact`)
- Contact form
- Company information
- FAQ section
- Business hours

## 🎯 Key Features Implemented

✅ **Fully Responsive Design** - Works on all devices  
✅ **Shopping Cart System** - Complete cart functionality  
✅ **Product Variants** - Multiple pack sizes with dynamic pricing  
✅ **Video Upload & Display** - Optional product videos with interactive playback  
✅ **Coupon System** - Discount codes with category-specific offers  
✅ **Search & Filtering** - Advanced product filtering  
✅ **Toast Notifications** - User feedback for all actions  
✅ **SEO Optimized** - Proper metadata and page titles  
✅ **Brand Consistent** - VIBE BITES branding throughout  
✅ **Performance Optimized** - Next.js Image optimization  

## 🚀 Deployment

The application is ready for deployment to platforms like:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any static hosting service

## 📞 Support

For questions or support, please contact:
- Email: hello@vibebites.com
- Phone: +91 98765 43210

---

**VIBE BITES** - Vibe Every Bite! 🍪✨
