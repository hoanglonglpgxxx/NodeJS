const express = require('express');
const { getOverview, getTour, getLoginForm, getAccount, updateUserData } = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, getOverview);
router.get('/tour/:slug', authController.isLoggedIn, getTour);
router.get('/login', authController.isLoggedIn, getLoginForm);
router.get('/me', authController.protect, getAccount);

router.post('/submit-user-data', authController.protect, updateUserData);

module.exports = router;   