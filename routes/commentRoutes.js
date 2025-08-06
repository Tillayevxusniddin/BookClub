const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { csrfProtection } = require('../middleware/csrfMiddleware');

// Kitob sharhlariga komment yozish, tahrirlash va o'chirish
router.get('/reviews/:reviewId/add', verifyToken, csrfProtection, commentController.showAddCommentForm);
router.post('/reviews/:reviewId/add', verifyToken, csrfProtection, commentController.addComment);
router.get('/:id/edit', verifyToken, csrfProtection, commentController.showEditCommentForm);
router.post('/:id/edit', verifyToken, csrfProtection, commentController.updateComment);
router.post('/:id/delete', verifyToken, csrfProtection, commentController.deleteComment);

module.exports = router;