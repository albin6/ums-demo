# User Management System

A complete user management application built with the MERN stack (MongoDB, Express.js, React, Node.js) using TypeScript, TailwindCSS, and Ant Design.

## Features

- **User Management**: User signup, login, profile viewing and editing
- **Admin Panel**: Admin login, user listing, search, pagination, block/unblock functionality
- **Profile Image Upload**: Users can upload profile images
- **Authentication**: JWT-based authentication for users and admin role protection
- **SOLID Principles**: Properly implemented OOP with dependency injection

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript, MongoDB with Mongoose
- **Frontend**: React, TypeScript, TailwindCSS, Ant Design
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: Zod for request validation
- **File Uploads**: Multer for image uploads

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or cloud instance)

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following content:
   ```
   PORT=5002
   MONGODB_URI=mongodb://localhost:27017/user-management
   JWT_SECRET=your-super-secret-jwt-key-for-dev-environment
   NODE_ENV=development
   ```

4. Build the project:
   ```bash
   npm run build
   ```

5. Start the server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend` directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:5002/api
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   npm run dev
   ```

## API Endpoints

### User Endpoints

- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (requires authentication)
- `PUT /api/users/profile` - Update user profile (requires authentication)
- `POST /api/users/upload` - Upload profile image (requires authentication)

### Admin Endpoints

- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get users list (requires admin authentication)
- `PATCH /api/admin/users/:id/block` - Block user (requires admin authentication)
- `PATCH /api/admin/users/:id/unblock` - Unblock user (requires admin authentication)

## Default Admin User

When the application starts for the first time, a default admin user is created:
- Email: `admin@example.com`
- Password: `admin123`

## Architecture

The backend follows SOLID principles with:
- Repository pattern with interfaces
- Service layer with interfaces
- Dependency injection container
- Proper separation of concerns
- Middleware for authentication and authorization