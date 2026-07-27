# 📊 DataLens - Smart CSV Analytics Dashboard

A full-stack MERN application for uploading, analyzing, cleaning, and visualizing CSV datasets.

🌐 **Live Demo:** https://data-lens-psi-drab.vercel.app

🔗 **Backend API:** https://datalens-backend-dke2.onrender.com

---

## 🚀 Features

### Authentication
- JWT Authentication
- User Registration
- Secure Login
- Logout
- Change Password
- Forgot Password using Email OTP
- Delete Account
- Welcome Email

### CSV Analytics
- Upload CSV files
- Dataset Summary
- Missing Value Analysis
- Duplicate Detection
- Outlier Detection
- Column Profiling
- Data Quality Score
- Dataset Comparison

### Visualization
- Interactive Charts
- Statistics Dashboard
- Distribution Analysis

### Data Cleaning
- Clean Dataset
- Download Cleaned CSV
- Export PDF Report

### Dataset Management
- Upload History
- Multiple Dataset Support
- Dataset Comparison

---

# 🛠 Tech Stack

## Frontend
- React
- Vite
- Axios
- Recharts

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT
- Nodemailer

## Deployment
- Vercel
- Render
- MongoDB Atlas

---

# 📷 Screenshots

> Add screenshots here.

Example:

- Login Page
- Dashboard
- CSV Upload
- Analytics
- Charts
- Dataset Comparison

---

# 📂 Project Structure

```
DataLens
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middleware
│   └── server.js
│
└── README.md
```

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/kavyachawla28/DataLens.git
```

Install frontend

```bash
cd client
npm install
npm run dev
```

Install backend

```bash
cd ../server
npm install
npm start
```

---

# Environment Variables

### Backend

```
MONGO_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
```

### Frontend

```
VITE_API_URL=http://localhost:5000/api
```

For production:

```
VITE_API_URL=https://datalens-backend-dke2.onrender.com/api
```

---

# Future Enhancements

- AI-powered insights
- Predictive analytics
- Excel support
- Dark mode
- Team collaboration
- Role-based access control

---

# License

MIT License