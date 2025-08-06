const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken } = require('../middleware/authMiddleware');
const { csrfProtection } = require('../middleware/csrfMiddleware');

router.get('/:id', verifyToken, profileController.showProfile);
router.get('/:id/edit', verifyToken, csrfProtection, profileController.showEditProfileForm);
router.post('/:id/edit', verifyToken, csrfProtection, profileController.updateProfile);

module.exports = router;