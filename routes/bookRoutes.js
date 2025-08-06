const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const { csrfProtection } = require('../middleware/csrfMiddleware');

router.get('/create', verifyToken, isAdmin, csrfProtection, bookController.showCreateBookForm);
router.get('/',csrfProtection, bookController.getAllBooks);
router.get('/:id', csrfProtection, bookController.getBookById);

router.post('/create', verifyToken, isAdmin, csrfProtection, bookController.createBook);
router.get('/:id/edit', verifyToken, isAdmin, csrfProtection, bookController.showEditBookForm);
router.post('/:id/edit', verifyToken, isAdmin, csrfProtection, bookController.updateBook);
router.post('/:id/delete', verifyToken, isAdmin, csrfProtection, bookController.deleteBook);

module.exports = router;