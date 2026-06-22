# ProNet

ProNet is a full-stack, production-ready professional networking web application built as a LinkedIn replica. It uses Node.js, Express.js, MongoDB, EJS, and Bootstrap 5.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas with Mongoose
- **Frontend:** EJS (Embedded JavaScript), Bootstrap 5, Custom CSS
- **Authentication:** JWT (JSON Web Tokens) stored in HTTP-only cookies, Bcrypt.js
- **File Uploads:** Multer

## Features
- **Authentication:** Register, Login, Logout with secure JWT and hashed passwords.
- **Profile:** Manage profile picture, cover photo, headline, experience, education, skills.
- **Feed:** Create posts, view posts from connections, like and comment on posts.
- **Network:** View people you may know, send, accept, or reject connection requests.
- **Messaging:** Real-time (or near real-time) messaging between connected users.
- **Jobs:** View job listings, search/filter jobs, apply to jobs.
- **Notifications:** Receive alerts for likes, comments, connection requests, and messages.
- **Search:** Global search for users and jobs.

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   cd pronet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory (use `.env.example` if provided) and add:
   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/pronet
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Run the Seed Script (Optional but recommended for testing)**
   ```bash
   npm run seed
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Deployment (Render)

1. Create a new Web Service on Render.
2. Connect your GitHub repository.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add all Environment Variables from your `.env` file to the Render dashboard.
6. Ensure your MongoDB Atlas cluster allows connections from anywhere (`0.0.0.0/0`) or specifically Render's IP addresses.

