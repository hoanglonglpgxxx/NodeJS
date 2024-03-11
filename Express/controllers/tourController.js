// const fs = require('fs');

const Tour = require('../models/tourModel');

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
exports.getAllTours = async (req, res) => {
    try {
        //BUILD QUERY

        //1A.Filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        //remove các field để query không lỗi
        excludedFields.forEach(el => delete queryObj[el]); //delete in JS: an operator, remove a property from an obj


        //1B. Advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));

        //2. Sorting: nếu sort=tên_field thì sort tăng dần, -tên_field thì sort giảm dần
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' '); //join các sort field
            console.log(sortBy);
            query = query.sort(sortBy);
        } else {
            query = query.sort({ price: 'desc' });//default sort theo createdAt DESC
            //c2. query = query.sort('-price'); //desc
            //c3. query = query.sort({price: -1}); //desc
        }

        console.log(JSON.parse(queryStr));

        //EXECUTE QUERY
        const tours = await query;
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

};

