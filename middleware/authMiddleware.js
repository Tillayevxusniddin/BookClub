const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    
    if (!token) {
        req.flash('error', "Bu amalni bajarish uchun tizimga kirishingiz kerak.");
        return res.status(401).redirect('/login');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            req.flash('error', "Sessiyangiz yaroqsiz yoki muddati tugagan. Iltimos, qayta kiring.");
            return res.status(403).redirect('/login');
        }
        req.user = user;
        next();
    });
};

module.exports = { verifyToken };