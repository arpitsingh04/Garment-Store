# Diamond Garment Backend API

This is the backend server for the Diamond Garment website. It provides API endpoints for products, gallery items, testimonials, and contact form submissions. The admin panel is now handled by the React frontend.

## Features

- **RESTful API** for products, gallery items, testimonials, and contact form submissions
- **Authentication** using JWT for secure admin access
- **File Upload** functionality for product, gallery, and testimonial images
- **MongoDB** database for data storage
- **Admin API endpoints** for React frontend admin panel

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

## Installation

### Quick Setup

1. Navigate to the server directory
2. Run the setup script:

**Windows:**
```
setup.bat
```

**Linux/Mac:**
```
chmod +x setup.sh
./setup.sh
```

This will install dependencies and seed the database with initial data.

### Manual Setup

1. Navigate to the server directory
2. Install dependencies:

```bash
cd server
npm install
```

3. The `.env` file is already configured with default settings:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/diamond-garment
JWT_SECRET=diamond_garment_secret_key_change_in_production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

4. Seed the database with initial data:

```bash
npm run seed
```

## Running the Server

To start the server in development mode:

```bash
npm run dev
```

To start the server in production mode:

```bash
npm start
```

## Seeding the Database

To seed the database with initial data:

```bash
# Create admin user
npm run seed:admin

# Import products and gallery items
npm run seed:data

# Or run both with a single command
npm run seed
```

## Admin Panel

The admin panel is now part of the React frontend. Access it at:

```
http://localhost:3000/admin
```

Default admin credentials:
- Email: admin@diamondgarment.com
- Password: admin123

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/register` - Register new admin (protected)

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Gallery

- `GET /api/gallery` - Get all gallery items
- `GET /api/gallery/:id` - Get single gallery item
- `POST /api/gallery` - Create new gallery item (protected)
- `PUT /api/gallery/:id` - Update gallery item (protected)
- `DELETE /api/gallery/:id` - Delete gallery item (protected)

### Contact Form

- `GET /api/contact` - Get all contact submissions (protected)
- `GET /api/contact/:id` - Get single contact submission (protected)
- `POST /api/contact` - Create new contact submission
- `PUT /api/contact/:id` - Update contact status (protected)
- `DELETE /api/contact/:id` - Delete contact submission (protected)

### File Upload

- `POST /api/upload` - Upload image (protected)

## Frontend Integration

To integrate with the frontend, update the API base URL in the frontend code to point to the backend server:

```javascript
// Example API call from frontend
fetch('/api/products')
  .then(response => response.json())
  .then(data => {
    // Handle data
  });
```

## License

This project is licensed under the MIT License.
