const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true }); //allow nested routes

router.user(authController.protect);

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.restrictRole('user'),
        reviewController.setTourUserIds,
        reviewController.createReview);

router.route('/:id')
    .get(reviewController.getReview)
    .patch(
        authController.restrictRole('user', 'admin'),
        reviewController.updateReview)
    .delete(
        authController.restrictRole('user', 'admin'),
        reviewController.deleteReview);

module.exports = router;
