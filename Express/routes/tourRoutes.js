const express = require('express');
const fs = require('fs');
const toursData = JSON.parse(fs.readFileSync(`./Express/data/tours-simple.json`));

const router = express.Router(); // là 1 middleware

const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: toursData.length,
        data: {
            tours: toursData
        }
    });
};

const getTour = (req, res) => {
    console.log(req.params);

    const id = req.params.id * 1; //turn string to number
    const tour = toursData.find(el => el.id === id);

    // if (id > toursData.length) {
    if (!tour) {
        return res.status(404).json({
            'status': 'fail',
            'message': 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};

const createTour = (req, res) => {
    const newId = toursData[toursData.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    toursData.push(newTour);
    fs.writeFile(`${__dirname}/data/tours-simple.json`, JSON.stringify(toursData), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
    // res.send('Done');
};

const updateTour = (req, res) => {
    if (req.params.id * 1 > toursData.length) {
        return res.status(404).json({
            'status': 'fail',
            'message': 'Invalid ID'
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    });
};

const deleteTour = (req, res) => {
    if (req.params.id * 1 > toursData.length) {
        return res.status(404).json({
            'status': 'fail',
            'message': 'Invalid ID'
        });
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
};


router
    .route('/')
    .get(getAllTours)
    .post(createTour);

router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;