const fs = require('node:fs');
const Tour = require('../models/tourModel');
//BUILD QUERY
const APIFeatures = require('../utils/apiFeatures');

//const toursData = JSON.parse(fs.readFileSync(`${__dirname}/../data/tours-simple.json`)); FOR TESTING PURPOSE

/* EXAMPLE WHEN TESTING WITH MIDDLEWARE(alrd avail when using mongoose)
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
*/

function writeLog(req, res) {
    let logString = ([req.requestTime, req.method, req.originalUrl, res.statusCode].join(' '));
    logString = `${logString}\r\n`;
    fs.appendFile("./api_log.log", logString, (err) => err && console.error(err));
}

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage, price';
    req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
    next();
};

exports.getAllTours = async (req, res) => {
    try {
        //EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limit()
            .paginate();
        const tours = await features.query;

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours: tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
    writeLog(req, res);
};

exports.getTour = async (req, res) => {
    //const id = req.params.id * 1; //turn string to number
    /* const tour = toursData.find(el => el.id === id);
     */

    try {
        const tour = await Tour.findById(req.params.id);
        //có thể thay bằng query này : Tour.findOne({_id: req.params.id})
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
    writeLog(req, res);
};

exports.createTour = async (req, res) => {
    /* TEST WITH STATIC JSON FILE
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
    }); */

    try {
        //tìm hiểu .create(),.save(),xem lại section async await
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
    writeLog(req, res);
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true

        });

        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        });

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent'
        });
    }
    writeLog(req, res);
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent'
        });
    }
    writeLog(req, res);
};


