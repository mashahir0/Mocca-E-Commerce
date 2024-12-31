E-Commerce Website - Clothing Brand
Overview
This is a full-featured e-commerce website for a clothing brand, designed to deliver a seamless shopping experience to users and a powerful management platform for administrators. The project includes a user-friendly front-end for customers and an intuitive admin panel to manage various aspects of the business.

Features :- 

User Side

Buy Products: Browse and purchase clothing items easily.
Razorpay Integration: Secure online payment gateway for hassle-free transactions.
Wallet: In-app wallet for quick and convenient payments.
Cart: Add and manage products in the shopping cart.
Wishlist: Save favorite products for later.
User Profile Management: Add and edit user details like name, email, and profile picture.
Address Management: Add, edit, and delete delivery addresses.
Order Management: View and track order status.

Admin Side

Product Management: Add, edit, and delete products with images and details.
User Management: View, manage, and block/unblock users.
Coupon Management: Create and manage discount coupons for promotions.
Category Management: Manage product categories for better organization.
Sales Graphs: Visual representation of sales trends and revenue.
Sales Report: Detailed downloadable sales reports.
Offer Module: Create and manage product and category-specific offers.

Technology Stack :- 

Backend

Node.js: JavaScript runtime environment.
Express.js: Framework for building REST APIs.
MongoDB: NoSQL database for data storage.
Razorpay API: Integrated for secure payment transactions.

Frontend

React.js: Component-based front-end library for a dynamic UI.
Architecture
MVC (Model-View-Controller): Ensures a clean separation of concerns for scalability and maintainability.

Installation :-

Prerequisites

Node.js installed on your system.
MongoDB installed or access to a cloud database.
Razorpay account for payment integration.
Git for version control.
Steps to Run the Project
Clone the Repository:

bash
Copy code
gh repo clone mashahir0/Mocca-E-Commerce
Navigate to the Project Directory:

bash
Copy code
cd ecommerce-clothing-brand
Install Dependencies:

Backend:
bash
Copy code
cd backend
npm install
Frontend:
bash
Copy code
cd ../frontend
npm install
Environment Variables:

Create a .env file in the backend directory with the following variables:
makefile
Copy code
MONGO_URI=your-mongodb-uri
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
JWT_SECRET=your-jwt-secret
Start the Application:

Backend:
bash
Copy code
cd backend
npm start
Frontend:
bash
Copy code
cd ../frontend
npm start

Access the app:

User Side: (Link currently not available)
Admin Panel: (Link currently not available)

Folder Structure :- 

Backend

controllers/: Contains business logic for API endpoints.
models/: MongoDB schemas and models.
routes/: API routes for user and admin functionalities.
middlewares/: Authentication and other reusable middleware.

Frontend

components/: Reusable React components.
pages/: Page-level components for routing.
services/: API calls and utilities.
store/: Redux state management.

Key Functionalities :-

User Features

Intuitive product filtering and search.
Razorpay integration for a smooth checkout process.
Personalized profile and order tracking.
(etc..)

Admin Features

Effortless product, user, and category management.
Sales performance insights through graphs and reports.
(etc..)

Future Enhancements :- 

Add support for multi-language and currency.
AI-driven product recommendations.



Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

Contact
For any queries or support, reach out at:

Email: mashahirpv@gmail.com







