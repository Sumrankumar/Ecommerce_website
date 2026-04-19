# Ecommerce_website

FullStack E-Commerce website using MERN stack

## Project Overview

This is a complete full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js), providing a robust platform for online shopping with both customer and admin functionalities.

---
## 🚀 Live Demo
[Visit Website](https://ecommerce-website-henna-one.vercel.app/)

## Project Structure

### Project Folder Organization

```
Ecommerce_website/
├── backend/                          # Node.js/Express backend server
│   ├── config/
│   │   └── db.js                    # Database configuration
│   ├── controllers/                 # Route request handlers
│   │   ├── userController.js        # User authentication & management
│   │   ├── productController.js     # Product CRUD operations
│   │   └── orderController.js       # Order management
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT authentication middleware
│   ├── models/                      # MongoDB schemas
│   │   ├── user.js                  # User schema
│   │   ├── product.js               # Product schema
│   │   └── order.js                 # Order schema
│   ├── routes/                      # API route definitions
│   │   ├── userRoutes.js            # User endpoints
│   │   ├── productRoutes.js         # Product endpoints
│   │   └── orderRoutes.js           # Order endpoints
│   ├── utils/
│   │   └── mailer.js                # Email notification service
│   ├── package.json                 # Backend dependencies
│   └── server.js                    # Express server entry point
│
├── frontend/                         # React + Vite frontend application
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── Navbar.jsx           # Navigation header
│   │   │   ├── Footer.jsx           # Footer component
│   │   │   ├── ProductCard.jsx      # Product listing card
│   │   │   ├── ErrorAlert.jsx       # Error notification
│   │   │   ├── LoadingSpinner.jsx   # Loading indicator
│   │   │   ├── StatusBadge.jsx      # Status display badge
│   │   │   └── AdminLayout.jsx      # Admin dashboard layout
│   │   ├── context/                 # React Context API
│   │   │   ├── AuthContext.jsx      # Authentication context
│   │   │   └── CartContext.jsx      # Shopping cart context
│   │   ├── pages/                   # Page components
│   │   │   ├── HomePage.jsx         # Landing page
│   │   │   ├── ProductDetailsPage.jsx # Product detail view
│   │   │   ├── CartPage.jsx         # Shopping cart
│   │   │   ├── CheckoutPage.jsx     # Checkout process
│   │   │   ├── PaymentPage.jsx      # Payment processing
│   │   │   ├── LoginPage.jsx        # User login
│   │   │   ├── RegisterPage.jsx     # User registration
│   │   │   ├── MyOrdersPage.jsx     # User order history
│   │   │   ├── OrderDetailsPage.jsx # Order details view
│   │   │   ├── AdminDashboardPage.jsx # Admin overview
│   │   │   ├── ManageProductsPage.jsx # Admin product management
│   │   │   ├── ManageOrdersPage.jsx # Admin order management
│   │   │   ├── AddProductPage.jsx   # Add new product
│   │   │   └── NotFoundPage.jsx     # 404 error page
│   │   ├── routes/                  # Route protection
│   │   │   ├── PrivateRoute.jsx     # Protected user routes
│   │   │   └── AdminRoute.jsx       # Protected admin routes
│   │   ├── services/                # API service calls
│   │   │   ├── api.js               # Axios instance & HTTP config
│   │   │   ├── authService.js       # Authentication API calls
│   │   │   ├── productService.js    # Product API calls
│   │   │   └── orderService.js      # Order API calls
│   │   ├── utils/                   # Utility functions
│   │   │   ├── constants.js         # Application constants
│   │   │   └── helpers.js           # Helper functions
│   │   ├── App.jsx                  # Root React component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styling
│   ├── public/                      # Static assets
│   ├── vite.config.js               # Vite bundler configuration
│   ├── eslint.config.js             # ESLint configuration
│   ├── package.json                 # Frontend dependencies
│   └── README.md                    # Frontend documentation
│
└── README.md                         # Project documentation
```

---

## Database Structure

### Database Schema

The application uses MongoDB with the following collections:

#### 1. Users Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["user", "admin"], default: "user"),
  address: String,
  phone: String,
  createdAt: Date (default: now),
  updatedAt: Date
}
```

#### 2. Products Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  price: Number (required),
  category: String,
  stock: Number (default: 0),
  image: String (URL),
  sku: String (unique),
  rating: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. Orders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  items: [{
    productId: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number (required),
  status: String (enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending"),
  paymentStatus: String (enum: ["unpaid", "paid", "refunded"], default: "unpaid"),
  shippingAddress: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Installation Manual

### Software Requirements

#### Prerequisites
- **Node.js** (v14.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v6.0 or higher) - Comes with Node.js
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - Alternative: MongoDB Atlas (Cloud) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** (v2.0 or higher) - [Download](https://git-scm.com/)
- **Code Editor** - Visual Studio Code recommended - [Download](https://code.visualstudio.com/)

### Installation Steps

#### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Ecommerce_website
```

#### Step 2: Backend Installation & Configuration

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in the backend directory with the following configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ecommerce?retryWrites=true&w=majority
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   
   # Email Configuration (for mailer.js)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

4. Start MongoDB:
   - **Local MongoDB**: `mongod`
   - **MongoDB Atlas**: Connection string set in `.env`

5. Start the backend server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```
   
   Backend will run on `http://localhost:5000`

#### Step 3: Frontend Installation & Configuration

1. Navigate to frontend directory (from project root):
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:5173`

### Verification Steps

1. **Backend API**: Visit `http://localhost:5000/api/` and verify the API is running
2. **Frontend App**: Visit `http://localhost:5173` and verify the application loads
3. **Database**: Check MongoDB connection in browser console (Network tab)

### Database Setup

1. MongoDB will automatically create the database on first connection
2. Collections will be created when you perform operations
3. To seed initial data (products, admin user), create a seed script or use MongoDB Compass

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000/5173 already in use | Change PORT in `.env` or kill the process using the port |
| MongoDB connection denied | Verify connection string, check MongoDB is running, verify credentials |
| CORS errors | Ensure FRONTEND_URL in backend `.env` matches your frontend URL |
| Module not found errors | Run `npm install` again, delete node_modules and package-lock.json, then reinstall |
| API calls failing | Check backend `.env` configuration, verify both servers are running |

---

## Features

- **User Authentication**: Register, login, and JWT-based authorization
- **Product Management**: Browse products, view details, filter by category
- **Shopping Cart**: Add/remove items, quantity adjustment
- **Checkout**: Complete purchase process with payment integration
- **Order Management**: Track orders, view order history
- **Admin Dashboard**: Manage products, orders, and users
- **Error Handling**: Comprehensive error messages and validation
- **Responsive Design**: Works on desktop and mobile devices

---

## License

This project is open source and available under the MIT License. 
