const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError(`No tour founded with ID ${req.params.id}`, 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc) {
        return next(new AppError(`No document founded with ID ${req.params.id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
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

    const doc = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

exports.getOne = (Model, popOpts) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOpts) query = query.populate(popOpts);

    const doc = await query;

    if (!doc) {
        return next(new AppError(`No document founded with ID ${req.params.id}`, 404));
    }
    //có thể thay bằng query này : Tour.findOne({_id: req.params.id})
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

exports.getAll = Model => catchAsync(async (req, res, next) => {
    //Allow nested GET reviews routes
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    //EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limit()
        .paginate();
    const doc = await features.query;
    // if (process.env.NODE_ENV === 'development') doc = await features.query.explain();

    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            data: doc
        }
    });
});