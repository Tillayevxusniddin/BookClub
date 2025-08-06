const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { csrfProtection } = require('../middleware/csrfMiddleware');

router.get('/', csrfProtection, postController.getAllPosts);
router.get('/create', verifyToken, csrfProtection, postController.showCreateForm);
router.post('/create', verifyToken, upload.array('images', 5), csrfProtection, postController.createPost);
router.get('/:id', csrfProtection, postController.getPost);

module.exports = router;