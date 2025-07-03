# 🏨 Hotel Management System

A full-stack hotel management application built with **Next.js** (frontend) and **NestJS** (backend). This system provides comprehensive room booking, reservation management, and administrative features for hotels.

![Hotel Management System](https://img.shields.io/badge/Status-Active-brightgreen.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.0-blue.svg)
![NestJS](https://img.shields.io/badge/NestJS-10.0-red.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green.svg)

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with role-based access control
- **User roles**: Customer, Staff, Admin
- **Secure login/registration** with input validation
- **Persistent sessions** with automatic token refresh

### 🏠 Room Management
- **Room types**: Basic, Premium, Suite
- **Real-time availability** checking
- **Dynamic pricing** and capacity management
- **Image galleries** and amenities
- **Admin room CRUD** operations

### 📅 Reservation System
- **Smart date picker** with conflict prevention
- **Real-time availability** validation
- **Guest information** management
- **Booking confirmation** and tracking
- **Reservation history** for users

### 📊 Admin Dashboard
- **Real-time statistics** and analytics
- **Guest management** with customer profiles
- **Room status** monitoring and control
- **Revenue tracking** and reporting
- **User management** and role assignment

### 🎨 User Interface
- **Modern, responsive design** with Tailwind CSS
- **Dark/Light mode** support
- **Mobile-first** approach
- **Intuitive navigation** and user experience

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand with persistence
- **HTTP Client**: Axios
- **Date Handling**: React DatePicker
- **Icons**: Lucide React

### Backend (Server)
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Passport
- **Validation**: Class Validator + Class Transformer
- **Documentation**: Swagger/OpenAPI
- **Security**: CORS, Guards, Decorators

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18.0 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or cloud instance)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hotel-management
```

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start the development server
npm run start:dev
```

The backend will start on: `http://localhost:8080`

### 3. Frontend Setup
```bash
# Navigate to client directory (in a new terminal)
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on: `http://localhost:3000`

## 📁 Project Structure

```
hotel-management/
├── client/                 # Next.js Frontend Application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── stores/        # Zustand state stores
│   │   ├── services/      # API service layers
│   │   ├── types/         # TypeScript type definitions
│   │   └── lib/           # Utility functions
│   ├── public/            # Static assets
│   └── package.json
├── server/                # NestJS Backend Application
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── rooms/         # Room management module
│   │   ├── reservations/  # Reservation module
│   │   ├── common/        # Shared utilities
│   │   └── database/      # Database configuration
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/hotel-management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=8080
```

#### Frontend (environment variables)
The frontend automatically connects to `http://localhost:8080/api` for the backend.

## 📚 API Documentation

The backend provides comprehensive API documentation using **Swagger/OpenAPI**.

### 🔗 Access API Documentation
Once the backend is running, visit:
**[http://localhost:8080/api/docs](http://localhost:8080/api/docs)**

### 📖 API Endpoints Overview

#### 🔐 Authentication (`/api/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `GET /auth/me` - Get current user info
- `GET /auth/users` - Get all users (Admin only)

#### 🏠 Rooms (`/api/rooms`)
- `GET /rooms` - Get all rooms with filters
- `GET /rooms/available` - Get available rooms
- `GET /rooms/:id` - Get room by ID
- `POST /rooms` - Create room (Admin only)
- `PATCH /rooms/:id` - Update room (Admin only)
- `DELETE /rooms/:id` - Delete room (Admin only)

#### 📅 Reservations (`/api/reservations`)
- `GET /reservations` - Get reservations (filtered by role)
- `POST /reservations` - Create new reservation
- `GET /reservations/my-reservations` - Get user reservations
- `GET /reservations/:id` - Get reservation details
- `PATCH /reservations/:id` - Update reservation
- `DELETE /reservations/:id` - Cancel reservation

### 🔑 Authentication in API
1. **Login** via `/api/auth/login` to get JWT token
2. **Include token** in Authorization header: `Bearer <your-token>`
3. **Use "Authorize" button** in Swagger UI for easy testing

## 👥 User Roles & Permissions

### 🛡️ Customer
- View available rooms
- Make reservations
- View/edit own reservations
- Update profile information

### 👨‍💼 Staff
- All customer permissions
- View all reservations (limited data)
- Access staff dashboard

### 🔑 Admin
- All staff permissions
- Full room management (CRUD)
- Complete reservation management
- User management and role assignment
- Access to analytics and reports

## 🏃‍♂️ Development Scripts

### Backend Commands
```bash
npm run start:dev    # Start development server
npm run build        # Build for production
npm run start:prod   # Start production server
npm run test         # Run tests
npm run lint         # Run ESLint
```

### Frontend Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🔍 Testing the Application

### 1. **Default Admin Account**
```
Email: admin@hotel.com
Password: admin123456
```

### 2. **Test Customer Account**
```
Email: test@test.com
Password: test123
```

### 3. **Testing Workflow**
1. **Register/Login** as a customer
2. **Browse rooms** on the homepage
3. **Select dates** and make a reservation
4. **Login as admin** to manage rooms and view all reservations
5. **Test API endpoints** using Swagger documentation

## 🛡️ Security Features

- **JWT Authentication** with secure token handling
- **Role-based access control** (RBAC)
- **Input validation** and sanitization
- **CORS protection** configured
- **Password hashing** with bcrypt
- **Request rate limiting** ready for production

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 **Mobile devices** (320px+)
- 📱 **Tablets** (768px+)
- 💻 **Desktops** (1024px+)
- 🖥️ **Large screens** (1440px+)

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Start with: `npm run start:prod`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy static files or use Next.js hosting
3. Configure API base URL for production

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- 📧 **Email**: support@hotelmanagement.com
- 📖 **Documentation**: [API Docs](http://localhost:8080/api/docs)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-repo/hotel-management/issues)

---

### 🎯 Key Features Demo

| Feature | Customer View | Admin View |
|---------|---------------|------------|
| **Room Browsing** | ✅ Filter & search rooms | ✅ Full CRUD operations |
| **Reservations** | ✅ Create & manage own | ✅ View & manage all |
| **Dashboard** | ❌ Limited access | ✅ Full analytics |
| **User Management** | ❌ Profile only | ✅ All users |

### 🔧 Quick Development Tips

- **Hot Reload**: Both frontend and backend support hot reload
- **API Testing**: Use Swagger UI for quick endpoint testing
- **Database**: MongoDB Compass recommended for database management
- **Debugging**: VS Code debugger configurations included

**Ready to start building? Follow the Quick Start guide above!** 🚀 