const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');
const { csrfProtection } = require('../middleware/csrfMiddleware');

router.get('/books/:bookId/add', verifyToken, csrfProtection, reviewController.showAddReviewForm);
router.post('/books/:bookId/add', verifyToken, csrfProtection, reviewController.addReview);
router.get('/:id/edit', verifyToken, csrfProtection, reviewController.showEditReviewForm);
router.post('/:id/edit', verifyToken, csrfProtection, reviewController.updateReview);
router.post('/:id/delete', verifyToken, csrfProtection, reviewController.deleteReview);

module.exports = router;