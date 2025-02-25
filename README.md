# E-Commerce Application

A full-stack e-commerce application with user authentication, product management, and shopping cart functionality.

## Project Structure


## Frontend

### Technologies Used
- React 18
- React Router v6
- Tailwind CSS
- Shadcn UI Components
- Lucide React Icons
- Vite

### Features
- User authentication (Login/Register)
- Admin dashboard for product management
- Product catalog with grid view
- Shopping cart functionality
- Responsive design
- Protected routes

### Setup
```bash
cd Frontend
npm install
npm run dev



### Backend
Technologies Used
Python
Flask
Sqilit
JWT Authentication
Bcrypt for password hashing

##Features
RESTful API
User authentication
Product CRUD operations
Protected routes for admin
Data validation

##Setup
cd Backend
pip install -r requirements.txt
python run.py

### API Endpoints
## Authentication

POST /api/auth/register - Register new user
POST /api/auth/login - User login


## Products
GET /api/products - Get all products
POST /api/products - Add new product (Admin only)
PUT /api/products/:id - Update product (Admin only)
DELETE /api/products/:id - Delete product (Admin only)
