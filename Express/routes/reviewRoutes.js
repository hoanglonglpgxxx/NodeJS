const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true }); //allow nested routes

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(authController.protect, authController.restrictRole('user'), reviewController.createReview);

router.route('/:id').delete(authController.protect, authController.restrictRole('user', 'admin'), reviewController.deleteReview);

module.exports = router;
