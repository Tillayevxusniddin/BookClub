const express = require('express');
const router = express.Router();
const blogCommentController = require('../controllers/blogCommentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { csrfProtection } = require('../middleware/csrfMiddleware');

// Komment yozish uchun tizimga kirish shart va CSRF himoyasi kerak
router.post('/posts/:postId', verifyToken, csrfProtection, blogCommentController.createComment);

module.exports = router;