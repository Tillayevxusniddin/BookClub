const express = require('express');
const router = express.Router();
const blogCommentController = require('../controllers/blogCommentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { csrfProtection } = require('../middleware/csrfMiddleware');

router.post('/posts/:postId', verifyToken, csrfProtection, blogCommentController.createComment);

module.exports = router;