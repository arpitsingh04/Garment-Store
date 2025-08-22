# Diamond Garment Frontend

This is the React frontend for the Diamond Garment website, including both the public website and the admin panel.

## Features

### Public Website
- **Modern responsive design** with mobile-first approach
- **Pinterest-style masonry gallery** with waterfall layout
- **Interactive product showcase** with category filtering
- **Contact form** with validation
- **About page** with company information
- **Smooth animations** and modern UI components

### Admin Panel
- **React-based admin interface** with modern design
- **Dashboard** with statistics and recent data
- **Product management** with image upload
- **Gallery management** with category organization
- **Testimonial management** with rating system and approval workflow
- **Contact form submissions** with status tracking
- **Secure authentication** with JWT tokens
- **Responsive design** optimized for mobile devices

## Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **React Hook Form** for form handling
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **Swiper** for carousels
- **React Masonry CSS** for gallery layout

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on port 5000

## Installation

1. Navigate to the project directory:
```bash
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Admin Panel Access

The admin panel is accessible at:
```
http://localhost:3000/admin
```

Default admin credentials:
- Email: admin@diamondgarment.com
- Password: admin123

## Admin Panel Features

### Dashboard
- Overview statistics for products, gallery items, testimonials, and contacts
- Recent products and contact submissions
- Quick access to all management sections

### Product Management
- Add, edit, and delete products
- Image upload with preview
- Category organization (Hospital, School, Sports, Hotel, Industrial, Scout & NCC)
- Rich text descriptions

### Gallery Management
- Add, edit, and delete gallery items
- Image upload with preview
- Category-based organization
- Responsive masonry layout

### Testimonial Management
- Add, edit, and delete customer testimonials
- Image upload for customer photos
- 5-star rating system
- Featured testimonial marking
- Approval workflow for testimonials
- Character count validation (100-1000 characters)
- Mobile-optimized forms

### Contact Management
- View all contact form submissions
- Update submission status (New, Read, Responded)
- Contact details with clickable email and phone links
- Delete unwanted submissions

## Project Structure

```
project/
├── public/
├── src/
│   ├── components/
│   │   ├── admin/           # Admin panel components
│   │   │   ├── AdminLayout.tsx
│   │   │   └── Modal.tsx
│   │   └── common/          # Shared components
│   ├── hooks/               # Custom React hooks
│   │   └── useAuth.ts       # Authentication hook
│   ├── pages/
│   │   ├── admin/           # Admin panel pages
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminProducts.tsx
│   │   │   ├── AdminGallery.tsx
│   │   │   ├── AdminTestimonials.tsx
│   │   │   └── AdminContacts.tsx
│   │   └── [public pages]   # Public website pages
│   ├── routes/              # Route configurations
│   │   └── AdminRoutes.tsx
│   ├── types/               # TypeScript type definitions
│   │   └── admin.ts
│   ├── utils/               # Utility functions
│   │   └── api.ts           # API client
│   └── App.tsx
├── package.json
└── README.md
```

## API Integration

The frontend communicates with the backend API running on port 5000. All admin operations require authentication via JWT tokens.

### API Endpoints Used
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/gallery` - Get gallery items
- `POST /api/gallery` - Create gallery item
- `PUT /api/gallery/:id` - Update gallery item
- `DELETE /api/gallery/:id` - Delete gallery item
- `GET /api/testimonials/admin/all` - Get all testimonials (admin)
- `POST /api/testimonials` - Create testimonial
- `PUT /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial
- `GET /api/contact` - Get contact submissions
- `PUT /api/contact/:id` - Update contact status
- `DELETE /api/contact/:id` - Delete contact
- `POST /api/upload` - Upload images

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Environment Variables

The frontend automatically connects to the backend API. No additional environment variables are required for development.

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `build` folder to your hosting service

3. Ensure the backend API is accessible from your production domain

## Mobile Optimization

The admin panel is fully optimized for mobile devices with:
- Responsive sidebar navigation
- Touch-friendly buttons and forms
- Optimized table layouts for small screens
- Mobile-first design approach
- Proper viewport handling

## Security Features

- JWT token-based authentication
- Protected routes for admin access
- Automatic token refresh handling
- Secure API communication
- Input validation and sanitization

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Implement responsive design for all new components
4. Add proper error handling and loading states
5. Test on both desktop and mobile devices
