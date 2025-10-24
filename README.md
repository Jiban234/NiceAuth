# NiceAuth Platform

A full-stack authentication system built with React, Node.js, Express, and MongoDB. Features include user registration, login, email verification, and password reset functionality.

![NiceAuth Platform](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- 🔐 **User Authentication** - Secure registration and login system
- ✉️ **Email Verification** - OTP-based email verification
- 🔑 **Password Reset** - Secure password recovery via email
- 🍪 **JWT Authentication** - Token-based authentication with HTTP-only cookies
- 🎨 **Modern UI** - Beautiful gradient design with Tailwind CSS
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔒 **Secure** - Password hashing with bcrypt and secure cookie handling

## Tech Stack

### Frontend
- React 19.1.0
- React Router DOM 7.7.0
- Tailwind CSS 4.1.11
- Axios
- React Toastify

### Backend
- Node.js
- Express 5.1.0
- MongoDB with Mongoose 8.16.4
- JWT for authentication
- Nodemailer for email services
- bcryptjs for password hashing

## Project Structure

```
├── client/                 # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── assets/        # Images, icons, and static files
│   │   ├── components/    # Reusable React components
│   │   ├── context/       # React Context for state management
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main App component
│   └── package.json
│
└── server/                # Backend Node.js application
    ├── config/            # Configuration files
    │   ├── mongodb.js     # Database configuration
    │   ├── nodemailer.js  # Email configuration
    │   └── emailTemplates.js
    ├── middleware/        # Express middleware
    │   ├── auth.js        # Authentication logic
    │   ├── userAuth.js    # User authentication middleware
    │   └── userController.js
    ├── models/            # MongoDB models
    │   └── usermodel.js
    ├── routes/            # API routes
    │   ├── authRoutes.js
    │   └── userRoutes.js
    └── server.js          # Entry point
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Gmail account for SMTP (or any email service)

### Clone the Repository
```bash
git clone https://github.com/jiban234/niceauth.git
cd niceauth
```

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=4000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SENDER_EMAIL=your_email@gmail.com
NODE_ENV=development
```

4. Start the server:
```bash
npm run server
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
VITE_BACKEND_URL=http://localhost:4000
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

### Server (.env)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 4000) |
| `MONGODB_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `SMTP_USER` | Email address for sending emails |
| `SMTP_PASSWORD` | App password for email account |
| `SENDER_EMAIL` | Sender email address |
| `NODE_ENV` | Environment (development/production) |

### Client (.env)
| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | Backend API URL |

## API Endpoints

### Authentication Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Logout
```http
POST /api/auth/logout
```

#### Send Verification OTP
```http
POST /api/auth/send-verify-otp
```

#### Verify Account
```http
POST /api/auth/verify-account
Content-Type: application/json

{
  "otp": "123456"
}
```

#### Send Reset OTP
```http
POST /api/auth/send-reset-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newsecurepassword"
}
```

### User Routes

#### Get User Data
```http
GET /api/user/data
```

## Usage

1. **Register**: Create a new account with name, email, and password
2. **Verify Email**: Check your email for OTP and verify your account
3. **Login**: Sign in with your credentials
4. **Forgot Password**: Request password reset OTP via email
5. **Reset Password**: Use OTP to set a new password

## Security Features

- Passwords are hashed using bcryptjs
- JWT tokens stored in HTTP-only cookies
- OTP expiration for email verification (24 hours)
- OTP expiration for password reset (15 minutes)
- CORS configuration for secure API access
- Input validation and sanitization

## Development

### Run Backend in Development Mode
```bash
cd server
npm run server
```

### Run Frontend in Development Mode
```bash
cd client
npm run dev
```

### Build for Production

#### Frontend
```bash
cd client
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Jiban Jyoti Das**
- GitHub: [@yourusername](https://github.com/jiban234)

## Acknowledgments

- Email templates design inspiration
- React and Tailwind CSS communities
- MongoDB and Express.js documentation

## Support

For support, [Send Email](mailto:jibanjyotidas016@gmail.com) or create an issue in the GitHub repository.

---

Made with ❤️ by Jiban Jyoti Das
