# SSE_GroupAssignment
Secure Software Engineering Final Group Project
# 🏠 Home Services App - Setup & Run Instructions

A secure and privacy-focused full-stack application for booking home services such as cleaning, repairs, and maintenance.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js (v14 or higher)** – [Download here](https://nodejs.org/)
- **MongoDB** – Choose one option:
  - [MongoDB Community Server](https://www.mongodb.com/try/download/community)
  - [MongoDB Atlas (Cloud)](https://www.mongodb.com/cloud/atlas)
- **Git** – [Download here](https://git-scm.com/downloads)

---

## 🚀 Quick Start

### 1 Download the Project
```bash
SSE_GroupAssignment

# If downloading as ZIP, extract and navigate to the folder
```

### 2 Project Structure
```
SSE_GroupAssignment/
├── backend/
│ ├── models/
│ │ ├── User.js
│ │ └── Job.js
│ ├── routes/
│ │ ├── users.js
│ │ └── jobs.js
│ ├── middleware/
│ │ └── authMiddleware.js
│ ├── server.js
│ ├── package.json
│ └── .env
├── frontend/
│ ├── public/
│ │ └── index.html
│ ├── src/
│ │ ├── components/
│ │ │ ├── HomeScreen.js
│ │ │ ├── LoginScreen.js
│ │ │ └── RegisterScreen.js
│ │ ├── App.js
│ │ └── index.js
│ └── package.json
└── README.md
```

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a .env file in the backend directory:
```
MONGODB_URI=mongodb://localhost:27017/home-service-app
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-secure-2024
PORT=3001
```

### 4. Start MongoDB
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Windows
# Start MongoDB Service from Services panel

# On Ubuntu
sudo systemctl start mongod
```

### 5. Start Backend Server
``` 
# Development mode (with auto-restart)
npm run dev

# Or production mode
npm start
```

## 🎨 Frontend Setup

### 1. Open New Terminal & Navigate to Frontend
``` bash
cd frontend
```



### 2. Install Dependencies
```
npm install
```
### 3. Start Frontend Development Server
```
npm start
```

## 🛠️ Development Scripts
```bash
# Install all dependencies (root, backend, frontend)
npm run install-all

# Start both backend and frontend simultaneously
npm run dev

# Start only backend
npm run backend

# Start only frontend  
npm run frontend
```

### Backend Scripts
```
cd backend
npm run dev      # Development with nodemon
npm start        # Production
```

### Frontend Scripts
```
cd frontend  
npm start        # Development server
npm run build    # Production build
npm test         # Run tests
```
## 📱 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/register` | User registration | No |
| POST | `/api/users/login` | User login | No |
| GET | `/api/jobs/client/:userId` | Get user's jobs | Yes |
| POST | `/api/jobs/create` | Create job | Yes |
| GET | `/api/jobs/available` | Get available jobs | Yes (Provider) |
| PUT | `/api/jobs/accept/:jobId` | Accept job | Yes (Provider) |
| PUT | `/api/jobs/update/:jobId` | Update job status | Yes (Provider) |
| PUT | `/api/jobs/client/update/:jobId` | Update job details | Yes (Client) |
| PUT | `/api/jobs/client/cancel/:jobId` | Cancel job | Yes (Client) |
| GET | `/api/jobs/provider/my-jobs` | Get provider's accepted jobs | Yes (Provider) |
| GET | `/api/health` | Backend health check | No |