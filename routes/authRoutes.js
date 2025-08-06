const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { csrfProtection } = require('../middleware/csrfMiddleware');

router.get('/register', csrfProtection, authController.showRegisterForm);
router.post('/register', csrfProtection, authController.registerUser);
router.get('/login', csrfProtection, authController.showLoginForm);
router.post('/login', csrfProtection, authController.loginUser);
router.get('/logout', authController.logoutUser);

module.exports = router;