require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');

// Import configuration
const connectDB = require('./config/db');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

// Initialize express app
const app = express();

// Connect to Database
connectDB();

// Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session and Flash messages
app.use(session({
    secret: process.env.JWT_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));
app.use(flash());

// View Engine Setup (EJS)
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// Global variables for templates
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.path = req.path;
    next();
});

// Check user for all routes to display in navbar
app.get('*', checkUser);

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const jobRoutes = require('./routes/jobRoutes');
const searchRoutes = require('./routes/searchRoutes');

app.use('/', authRoutes);
app.use('/profile', requireAuth, userRoutes);
app.use('/feed', requireAuth, postRoutes);
app.use('/network', requireAuth, connectionRoutes);
app.use('/messages', requireAuth, messageRoutes);
app.use('/notifications', requireAuth, notificationRoutes);
app.use('/jobs', requireAuth, jobRoutes);
app.use('/search', requireAuth, searchRoutes);

// Redirect root to feed or login
app.get('/', (req, res) => {
    if (req.cookies.jwt) {
        res.redirect('/feed');
    } else {
        res.redirect('/login');
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error/404', { title: 'Page Not Found' });
});

// Error middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
