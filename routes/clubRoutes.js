const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const { csrfProtection } = require('../middleware/csrfMiddleware');

router.get('/create', verifyToken, isAdmin, csrfProtection, clubController.showCreateClubForm);
router.get('/:id',csrfProtection, clubController.getClubById); 
router.get('/', csrfProtection, clubController.getAllClubs); 

router.post('/create', verifyToken, isAdmin, csrfProtection, clubController.createClub);
router.get('/:id/edit', verifyToken, csrfProtection, clubController.showEditClubForm); // Admin yoki egasi tahrirlay oladi (controller ichida tekshiriladi)
router.post('/:id/edit', verifyToken, csrfProtection, clubController.updateClub);
router.post('/:id/delete', verifyToken, csrfProtection, clubController.deleteClub);

module.exports = router;