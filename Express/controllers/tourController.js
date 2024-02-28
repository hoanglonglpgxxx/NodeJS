const fs = require('fs');

const toursData = JSON.parse(fs.readFileSync(`${__dirname}/../data/tours-simple.json`));

exports.checkID = (req, res, next, val) => {
    if (req.params.id * 1 > toursData.length) {
        return res.status(404).json({
            'status': 'fail',
            'message': 'Invalid ID'
        });
    };
    next();
};

exports.checkBody = (req, res, next) => {
    if (!req.name || !req.price) {
        return res.status(404).json({
            'status': 'fail',
            'message': 'Need price'
        });
    };
    next();
};

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: toursData.length,
        data: {
            tours: toursData
        }
    });
};

exports.getTour = (req, res) => {
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

exports.createTour = (req, res) => {
    const newId = toursData[toursData.length - 1].id + 1;
    const newTour = { id: newId, ...req.body };

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

exports.updateTour = (req, res) => {

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    });
};

exports.deleteTour = (req, res) => {

    res.status(204).json({
        status: 'success',
        data: null
    });
};

