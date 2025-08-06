const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { csrfProtection } = require('../middleware/csrfMiddleware');

// Barcha postlar ro'yxati (hamma uchun ochiq)
router.get('/', csrfProtection, postController.getAllPosts);

// Post yaratish (tizimga kirgan bo'lishi shart)
router.get('/create', verifyToken, csrfProtection, postController.showCreateForm);
router.post('/create', 
    verifyToken, 
    upload.array('images', 5), 
    csrfProtection,
    postController.createPost
);
// Bitta postni ko'rish (hamma uchun ochiq)
router.get('/:id', csrfProtection, postController.getPost);

module.exports = router;