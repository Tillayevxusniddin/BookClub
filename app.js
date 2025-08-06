const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const jwt = require('jsonwebtoken');
const expressLayouts = require('express-ejs-layouts');
const csrf = require('csurf');

// Barcha route'larni chaqirish
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

// Asosiy sozlamalar
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// EJS va Layouts sozlamalari
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Session va Flash sozlamalari
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production' }
}));
app.use(flash());

// CSRF himoyasi
// app.use(csrf({ cookie: true }));

// Barcha so'rovlar uchun ishlaydigan GLOBAL MIDDLEWARE
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

// --- ROUTE'LARNI ULASH ---
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

// --- XATOLIKLARNI QAYTA ISHLASH ---

// 404 (Sahifa topilmadi) xatoligi
app.use((req, res, next) => {
    res.status(404).render('error', { title: "Sahifa topilmadi", message: "Kechirasiz, siz qidirayotgan sahifa mavjud emas." });
});

// Umumiy xatolik qayta ishlovchisi (500 - Serverda xatolik)
app.use((err, req, res, next) => {
    console.error("UMUMIY XATOLIK QAYTA ISHLOVCHISI:", err);

    // YECHIM: CSRF token xatoligini alohida ushlaymiz va xavfsiz sahifaga yo'naltiramiz
    if (err.code === 'EBADCSRFTOKEN') {
        req.flash('error', 'Sessiya muddati tugagan yoki forma yaroqsiz. Iltimos, qayta urining.');
        return res.redirect('/'); // 'back' o'rniga asosiy sahifaga yo'naltiramiz
    }

    // Boshqa barcha xatoliklar uchun
    res.status(500).render('error', { 
        title: "Serverda Xatolik", 
        message: "Kechirasiz, kutilmagan xatolik yuz berdi.",
        error: process.env.NODE_ENV !== 'production' ? err : {} 
    });
});

// Ma'lumotlar bazasi va serverni ishga tushirish
db.sequelize.authenticate()
    .then(() => {
        console.log('Ma\'lumotlar bazasiga muvaffaqiyatli ulanildi.');
        app.listen(PORT, () => {
            console.log(`Server http://localhost:${PORT} manzilida ishlamoqda.`);
        });
    })
    .catch(err => {
        console.error('Ma\'lumotlar bazasiga ulanishda xatolik:', err);
    });