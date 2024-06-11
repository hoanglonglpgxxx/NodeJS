const express = require('express');
const { getOverview, getTour, getLoginForm } = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', getOverview);
router.get('/tour/:slug', authController.protect, getTour);
router.get('/login', getLoginForm);

module.exports = router;   