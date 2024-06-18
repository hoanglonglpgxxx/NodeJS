const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factoryHandler = require('./factoryHandler');
const multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'E:/NodeJS/Express/public/img/users');
    },
    filename: (req, file, cb) => {
        //user-<userId>-<timestamp>.jpeg
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    }
});

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

exports.uploadUserImg = upload.single('photo');

exports.getAllUsers = factoryHandler.getAll(User);

/**
 * Return filtered object with only allowed fields
 * @param {Object} obj 
 * @param {...any} allowedFields
 * @returns {Object} - Return a new object with only the allowed fields 
 */
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateData = catchAsync(async (req, res, next) => {
    //1. Create error if user try to update password (POSTs password data)
    if (await req.body.password || await req.body.confirmPassword) {
        return next(new AppError('This route is not for password updates. Please use /update-password', 400));
    }

    //2. Filter only allowed to update fields to update
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    //3. Update user document
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteSelf = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {
        active: false
    });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getUser = factoryHandler.getOne(User);

//DONT update password with this
exports.updateUser = factoryHandler.updateOne(User);

exports.deleteUser = factoryHandler.deleteOne(User);