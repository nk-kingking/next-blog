# Mini Blogging Platform

A full-stack blogging platform where users can create, read, update, and delete blog posts with authentication.

## Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Blog Management**: Create, edit, and delete your own blog posts
- **Pagination**: Browse through blogs with smooth pagination
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Author Control**: Only blog authors can edit/delete their posts
- **Real-time Updates**: State management with Zustand

## Tech Stack

### Frontend
- React 18
- Zustand (State Management)
- React Router v6
- Tailwind CSS
- Framer Motion
- DOMPurify (XSS Protection)
- date-fns

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn

## Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd mini-blog-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Start backend server:
```bash
npm start
```

Server runs on: `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Start frontend:
```bash
npm start
```
App runs on: `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Blogs
- `GET /api/blogs` - Get all blogs (paginated)
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create new blog (authenticated)
- `PUT /api/blogs/:id` - Update blog (author only)
- `DELETE /api/blogs/:id` - Delete blog (author only)

## Key Features Explained

### Custom useApi Hook
Handles all API requests with:
- Automatic token injection
- Loading state management
- Error handling
- Integration with Zustand store

### Authentication Flow
1. User registers/logs in
2. JWT token stored in localStorage
3. Token sent with each authenticated request
4. Auto-verification on app load

### Security Features
- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Input sanitization with DOMPurify
- CORS configuration
- Author-only edit/delete permissions

## Deployment

### Backend (Example: Render/Railway)
1. Set environment variables
2. Deploy from GitHub
3. Note the deployment URL

### Frontend (Example: Vercel/Netlify)
1. Update API_BASE URL in `useApi.js`
2. Deploy from GitHub
3. Set REACT_APP_API_URL environment variable

## Usage

1. **Register**: Create an account with email and password
2. **Login**: Access your account
3. **Create Blog**: Click "Write" to create a new blog post
4. **View Blogs**: Browse all published blogs
5. **Edit/Delete**: Manage your own blog posts

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is open source and available under the MIT License.

## Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## Acknowledgments

- Built as a coding challenge submission
- Uses modern React best practices
- Follows REST API conventions