// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Profile, Token } = require('../models');
require('dotenv').config();
const sequelize = require('../config/database');

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, role: user.role, username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
    );
    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
    );
    return { accessToken, refreshToken };
};

exports.showRegisterForm = (req, res) => {
    if (req.user) return res.redirect('/clubs');
    res.render('auth/register', {
        title: "Sign Up",
        csrfToken: req.csrfToken(),
    });
};

exports.registerUser = async (req, res) => {
    // Transaction boshlandi
    const t = await sequelize.transaction(); 
    try {
        const { username, email, password, firstName, lastName, bio } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({
            username, email, password: hashedPassword
        }, { transaction: t }); // Transactionni ko'rsatamiz

        await Profile.create({
            userId: newUser.id, firstName, lastName, bio
        }, { transaction: t }); // Transactionni ko'rsatamiz

        await t.commit(); // Hammasi to'g'ri bo'lsa, o'zgarishlarni saqlaymiz
        req.flash('success', "Siz muvaffaqiyatli ro'yxatdan o'tdingiz. Iltimos, tizimga kiring.");
        res.redirect('/login');
    } catch (error) {
        await t.rollback(); // Xatolik bo'lsa, o'zgarishlarni bekor qilamiz
        console.error("Ro'yxatdan o'tishda xatolik:", error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            req.flash('error', "Bu foydalanuvchi nomi yoki email allaqachon mavjud.");
        } else {
            req.flash('error', "Ro'yxatdan o'tishda kutilmagan xatolik yuz berdi.");
        }
        res.redirect('/register');
    }
};

exports.showLoginForm = (req, res) => {
    if (req.user) return res.redirect('/clubs');
    res.render('auth/login', {
        title: "Sign In",
        csrfToken: req.csrfToken(),
    });
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            req.flash('error', "Incorrect email or password.");
            return res.redirect('/login');
        }

        const { accessToken, refreshToken } = generateTokens(user);
        const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        // Store the refresh token in the database
        await Token.create({
            userId: user.id,
            token: refreshToken,
            expiry: expiryDate,
        });

        // Set cookies
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 15 * 60 * 1000 }); // 15 minutes
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days

        req.flash('success', `Welcome back, ${user.username}!`);
        res.redirect('/clubs');
    } catch (error) {
        console.error("Login Error:", error);
        req.flash('error', "An unexpected error occurred while logging in.");
        res.redirect('/login');
    }
};

exports.logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (refreshToken) {
            await Token.destroy({ where: { token: refreshToken } });
        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        req.flash('success', "You have successfully logged out.");
        res.redirect('/login');
    } catch (error) {
        console.error("Logout Error:", error);
        req.flash('error', "An unexpected error occurred during logout.");
        res.redirect('/');
    }
};

// Note: The refreshToken function is for APIs. If your app is purely server-rendered EJS,
// your global middleware in app.js should handle expired tokens by redirecting to login.
// I'm leaving it here in case you plan to build an API.
exports.refreshToken = async (req, res) => {
    // This logic is okay for an API context.
};