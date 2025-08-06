// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

// Admin panel sahifasini ko'rsatish (faqat adminlar uchun)
router.get('/', verifyToken, isAdmin, (req, res) => {
    res.render('admin/dashboard', {
        title: "Admin Dashboard",
        currentUser: req.user,
        errors: req.flash('error'),
        success: req.flash('success')
    });
});

module.exports = router;