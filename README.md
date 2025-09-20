A full-stack web application built as part of the Roxiler FullStack Intern Coding Challenge.
The project demonstrates secure backend APIs, a responsive frontend, role-based access control, form validation, and database integration.

Features:
1. Authentication & Authorization
Signup, Login, Change Password with JWT-based authentication.
Role-based access: Admin, User, Store Owner.

2. Admin
Add new users (Admin/User/Owner).
Add new stores.
View all users and filter by name, email, or role.
View all stores with their average ratings.

3. Normal User
View all stores.
Submit/update ratings (1–5).
See average rating of each store.

4. Store Owner
Dashboard: List of users who rated their stores.
View average rating of their stores.

5. Frontend
Built with React + TailwindCSS + Framer Motion.
Role-based dashboards (Admin, User, Owner).
Formik + Yup validation for Signup, Add Store, User Rating, and Admin Filters.
Responsive UI.

6. Backend
Built with Node.js + Express.
PostgreSQL database for persistence.
Role-based protected routes with middleware.

Tech Stack:
1. Frontend: React, TailwindCSS, Framer Motion, Formik, Yup, Axios, React Router.
2. Backend: Node.js, Express, JWT, Bcrypt, PostgreSQL.
3. Database: PostgreSQL

Setup Instructions:
1. Clone Repo
git clone https://github.com/your-username/roxiller-task.git
cd roxiller-task

2. Backend Setup
cd backend
npm install

Create a .env file:

PORT=5000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=roxiller_db
JWT_SECRET=your_jwt_secret
Run migrations or execute SQL schema provided in /backend/sql/schema.sql.

Start backend:
npm start

3. Frontend Setup
cd frontend
npm install

Create a .env file:
REACT_APP_API_URL=http://localhost:5000/api

Start frontend:
npm start

Visit: http://localhost:3000

Testing:
1. Admin
Login with seeded Admin account.
Add new users, add new stores.
View all users and stores.

2. User
Signup → Login → View stores.
Submit rating for a store.
Update rating if needed.

3. Store Owner
Login → Dashboard → View who rated their stores + average rating.

Project Structure:
1. backend/
├── server.js         
├── config/
│   └── db.js         
├── routes/
│   ├── authRoutes.js 
│   ├── userRoutes.js 
│   ├── adminRoutes.js
│   └── storeRoutes.js
├── controllers/
│   └── ...           
├── middleware/
│   └── authMiddleware.js
└── .env              

2. frontend/
├─ .env
├─ package.json
└─ src/
   ├─ index.js
   ├─ index.css
   ├─ App.jsx
   ├─ api.js
   ├─ contexts/
   │   └─ AuthContext.jsx
   ├─ components/
   │   ├─ NavBar.jsx
   │   ├─ ProtectedRoute.jsx
   │   └─ RatingControl.jsx
   └─ pages/
       ├─ Home.jsx
       ├─ Login.jsx
       ├─ Signup.jsx
       ├─ admin/
       │   ├─ AdminDashboard.jsx
       │   ├─ AdminUsers.jsx
       │   └─ AdminStores.jsx
       ├─ user/
       │   └─ StoresList.jsx
       └─ owner/
           └─ OwnerDashboard.jsx

<img width="1912" height="863" alt="1" src="https://github.com/user-attachments/assets/b3697c2e-a7d3-4fda-ba47-9be0241c142d" />
<img width="1877" height="827" alt="2" src="https://github.com/user-attachments/assets/87942425-dccb-4cea-a1a0-80532b74b87c" />
<img width="1908" height="861" alt="3" src="https://github.com/user-attachments/assets/f85dc2ae-8fac-45ca-bedd-c1479e3cbc32" />
<img width="1900" height="805" alt="4" src="https://github.com/user-attachments/assets/21edd565-ba04-4f5f-8713-736951f43f9e" />
<img width="1900" height="560" alt="5" src="https://github.com/user-attachments/assets/518cd31a-6696-49b1-8009-d11978efef97" />
<img width="1881" height="633" alt="6" src="https://github.com/user-attachments/assets/c272857d-93a6-4aef-bcf8-7e1f5b155ab2" />
