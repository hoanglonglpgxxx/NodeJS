const express = require('express');

const tourController = require('../controllers/tourController');

const router = express.Router(); // là 1 middleware

// router.param('id', tourController.checkID);

//create a checkBody middleware
//check if body contains the name and price property
//if not send 400
// add it to the post handler stack

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router
    .route('/')
    .get(tourController.getAllTours)
    // .post(tourController.checkBody, tourController.createTour);
    .post(tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;