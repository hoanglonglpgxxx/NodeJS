const multer = require('multer');
const sharp = require('sharp');

const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factoryHandler = require('./factoryHandler');

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

const multerStorage = multer.memoryStorage(); //lưu ảnh vào buffer

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);

// upload.single('image')
// upload.array('images', 5);

exports.resizeTourImages = (req, res, next) => {
    console.log(req.files);
    next();
};

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage, price';
    req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
    next();
};

exports.getAllTours = factoryHandler.getAll(Tour);

exports.getTour = factoryHandler.getOne(Tour, { path: 'reviews' });

exports.createTour = factoryHandler.createOne(Tour);

exports.updateTour = factoryHandler.updateOne(Tour);

exports.deleteTour = factoryHandler.deleteOne(Tour);

exports.getToursStats = catchAsync(async (req, res, next) => {
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

exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
        next(new AppError('Please provide latitude and longitude in the format lat,lng', 400));
    }

    const tours = await Tour.find({
        startLocation: {
            $geoWithin: {
                $centerSphere: [
                    [lng * 1, lat * 1], radius
                ]
            }
        }
    });

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }
    });
});

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    if (!lat || !lng) {
        next(new AppError('Please provide latitude and longitude in the format lat,lng', 400));
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: unit === 'mi' ? 0.000621371 : 0.001
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        total: distances.length,
        data: {
            data: distances
        }
    });
});