const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const jwt = require('jsonwebtoken');
const expressLayouts = require('express-ejs-layouts');
// const csrf = require('csurf');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const clubRoutes = require('./routes/clubRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const commentRoutes = require('./routes/commentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const postRoutes = require('./routes/postRoutes');
const blogCommentRoutes = require('./routes/blogCommentRoutes');

const db = require('./models');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production' }
}));
app.use(flash());
// app.use(csrf({ cookie: true }));

app.use(async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await db.User.findByPk(decoded.id, { attributes: ['id', 'username', 'role'] });
            if (user) {
                req.user = user.toJSON();
            }
        } catch (err) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
        }
    }
    
    res.locals.currentUser = req.user || null;
    res.locals.errors = req.flash('error');
    res.locals.success = req.flash('success');

    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }
    res.locals.dump = (obj) => JSON.stringify(obj, null, 2);

    next();
});

app.get('/', (req, res) => {
    req.user ? res.redirect('/clubs') : res.redirect('/login');
});

app.use('/', authRoutes);
app.use('/clubs', clubRoutes);
app.use('/books', bookRoutes);
app.use('/posts', postRoutes);
app.use('/profile', profileRoutes);
app.use('/reviews', reviewRoutes);
app.use('/comments', commentRoutes);
app.use('/comments/blog', blogCommentRoutes);
app.use('/admin', adminRoutes);

app.use((req, res, next) => {
    res.status(404).render('error', {
        title: "Page Not Found",
        message: "Sorry, the page you are looking for does not exist."
    });
});

app.use((err, req, res, next) => {
    console.error("ERROR HANDLER:", err);

    if (err.code === 'EBADCSRFTOKEN') {
        req.flash('error', 'Session expired or form is invalid. Please try again.');
        return res.redirect('/');
    }

    res.status(500).render('error', {
        title: "Server Error",
        message: "Sorry, an unexpected error occurred.",
        error: process.env.NODE_ENV !== 'production' ? err : {}
    });
});

db.sequelize.authenticate()
    .then(() => {
        console.log('Successfully connected to the database.');
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to the database:', err);
    });
