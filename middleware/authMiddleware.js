const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    
    if (!token) {
        req.flash('error', "You must be logged in to perform this action.");
        return res.status(401).redirect('/login');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            req.flash('error', "Your session is invalid or has expired. Please log in again.");
            return res.status(403).redirect('/login');
        }
        req.user = user;
        next();
    });
};

module.exports = { verifyToken };
