const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: true,
        minlength: [10, 'User name must equal or more than 10 characters'],
        maxlength: [255, 'User name must equal or more than 255 characters'],
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (val) {
                return val.test(/^[a-zA-Z0-9]([A-Za-z0-9_-]|([.])(?!\2)){1,63}@[a-zA-Z0-9_-]{2,250}(\.[a-zA-Z0-9]{2,4}){1,3}$/);
            },
            message: 'Email is invalid form'
        }
    },
    photo: {},
    password: {},
    confirmPassword: {},
});