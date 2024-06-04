const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router(); // là 1 middleware

// router.param('id', tourController.checkID);

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(authController.protect, authController.restrictRole('admin'), tourController.createTour);

router
    .route('/tour-stats')
    .get(tourController.getToursStats);

router
    .route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(authController.protect, authController.restrictRole('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;