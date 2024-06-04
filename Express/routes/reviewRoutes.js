const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true }); //allow nested routes

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictRole('user'),
        reviewController.setTourUserIds,
        reviewController.createReview);

router.route('/:id').delete(authController.protect, authController.restrictRole('user', 'admin'), reviewController.deleteReview);
router.route('/:id').patch(authController.protect, authController.restrictRole('user', 'admin'), reviewController.updateReview);

module.exports = router;
