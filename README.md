Book Club System
<p align="center">
<img src="https://img.icons8.com/plasticine/200/books.png" alt="Book Club Logo" width="150"/>
</p>

<p align="center">
A social platform designed for book lovers. This system allows users to create and join book clubs, discuss books, write reviews, and share their thoughts through blog posts.
</p>

<p align="center">
<a href="https://github.com/Tillayevxusniddin/book-club-system/blob/main/LICENSE">
<img src="https://img.shields.io/github/license/Tillayevxusniddin/book-club-system?style=for-the-badge" alt="License">
</a>
<a href="#">
<img src="https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js" alt="Node.js Version">
</a>
<a href="#">
<img src="https://img.shields.io/badge/Express-4.x-blue?style=for-the-badge&logo=express" alt="Express Version">
</a>
<a href="#">
<img src="https://img.shields.io/badge/PostgreSQL-14-blueviolet?style=for-the-badge&logo=postgresql" alt="PostgreSQL">
</a>
</p>


# ✨ Key Features

👥 User Management: Registration, login, profile management, and a role-based system (USER, ADMIN).

🔐 Secure Authentication: Robust authentication using JWT (Access and Refresh tokens).

📚 Book Clubs: Users can create clubs based on their interests or join existing ones.

📖 Books & Reviews: Add books to clubs, leave reviews with a 5-star rating system.

💬 Nested Comments: Hierarchical (nested) comments for reviews and blog posts, allowing for threaded discussions.

✍️ Blog Platform: Users can write and publish their own articles with #hashtags and images.

🛡️ CSRF Protection: Secures POST, PUT, DELETE requests using csurf.

🖼️ File Uploads: Image uploading functionality for blog posts, handled by multer.

# 🛠️ Tech Stack

```
Component       Technology

Backend         Node.js, Express.js

Database        PostgreSQL

ORM             Sequelize

Frontend        EJS (Embedded JavaScript), Express EJS Layouts

Authentication  JWT (jsonwebtoken), csurf

File Uploads    multer

Development     nodemon
```

# 🚀 Getting Started

Prerequisites
    Node.js (v16 or higher) 
    PostgreSQL

# Step-by-Step Guide
    1.Clone the repository:
        ```
        git clone https://github.com/Tillayevxusniddin/book-club-system.git
        cd book-club-system
        ```
    2.Install dependencies:
        ```
        npm install
        ```
    3.Set up environment variables:
        ```
        # .env
            DATABASE_URL=postgres://YOUR_USER:YOUR_PASSWORD@localhost:5432/YOUR_DATABASE
            PORT=3000
            ACCESS_TOKEN_SECRET=YOUR_ACCESS_TOKEN_SECRET
            REFRESH_TOKEN_SECRET=YOUR_REFRESH_TOKEN_SECRET
            ACCESS_TOKEN_EXPIRY=15m
            REFRESH_TOKEN_EXPIRY=7d
            SESSION_SECRET=YOUR_SESSION_SECRET
        ```
    4.Configure the database connection:
        Create a config folder in the root directory. Inside it, create a file named config.json and add the following configuration. Ensure the credentials here match your PostgreSQL setup.
        ```
            {
            "development": {
                "username": "your_user",
                "password": "your_password",
                "database": "your_database",
                "host": "localhost",
                "dialect": "postgres"
            },
            "test": {
                "username": "your_user",
                "password": "your_password",
                "database": "your_database",
                "host": "localhost",
                "dialect": "postgres"
            },
            "production": {
                "username": "your_user",
                "password": "your_password",
                "database": "your_database",
                "host": "localhost",
                "dialect": "postgres"
            }
            }
        ```
    5.Set up the database:
        In PostgreSQL, create a new database with the name you specified in your configuration files (e.g., book_club_db)
            Run the migrations to create the necessary tables:
        ```
        npm run migrate
        npm run seed
        ```
    6.Run the application:
        ```
        npm run dev
        ```

    The application is now running!
    Main Page: http://localhost:3000/

# 📁 Project Structure
    ```
    .
    ├── config/         # Database configuration (config.json)
    ├── controllers/    # Business logic
    ├── middleware/     # Custom middlewares (auth, CSRF, upload)
    ├── migrations/     # Database migrations
    ├── models/         # Sequelize models and associations
    ├── public/         # Static files (CSS, JS, images)
    ├── routes/         # API endpoints
    ├── views/          # EJS templates (pages)
    │   ├── layouts/
    │   └── partials/
    ├── .env            # Environment variables (secret)
    ├── app.js          # Main Express application file
    └── package.json    # Project dependencies and scripts
    ```


# 📬 Contact

Xusniddin Tillayev - tillayevx1@gmail.com

Project Link: https://github.com/Tillayevxusniddin/BookClub