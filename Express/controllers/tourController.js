const fs = require('node:fs');
const Tour = require('../models/tourModel');
//BUILD QUERY
const catchAsync = require('../utils/catchAsync');
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

exports.getAllTours = catchAsync(async (req, res) => {
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
    writeLog(req, res);
});

exports.getTour = catchAsync(async (req, res) => {
    //const id = req.params.id * 1; //turn string to number
    /* const tour = toursData.find(el => el.id === id);
     */

    const tour = await Tour.findById(req.params.id);
    //có thể thay bằng query này : Tour.findOne({_id: req.params.id})
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
    writeLog(req, res);
});


exports.createTour = catchAsync(async (req, res) => {
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


    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    });
});

exports.updateTour = catchAsync(async (req, res) => {
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
});

exports.deleteTour = catchAsync(async (req, res) => {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getToursStats = catchAsync(async (req, res) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                totalRated: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { totalRated: 1 }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: {
                    $month: '$startDates'
                },
                totalToursStarts: { $sum: 1 },//group số tour từng tháng
                toursName: { $push: '$name' }
            }
        },
        {
            $addFields: {
                month: '$_id'
            }
        },
        {
            $project: {
                _id: 0 //hide passed param at response
            }
        },
        {
            $sort: { totalToursStarts: -1 }
        },
        /*  {
             $limit: 6
         } */
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    });
});