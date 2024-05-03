const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const EMAIL_REG_EXP = /^[a-zA-Z0-9]([A-Za-z0-9_-]|([.])(?!\2)){1,63}@[a-zA-Z0-9_-]{2,250}(\.[a-zA-Z0-9]{2,4}){1,3}$/;

const isEmail = {
    validator: function (val) {
        return EMAIL_REG_EXP.test(val);
    },
    message: 'Email is invalid form'
};

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: [true, 'Please tell us your name'],
        minlength: [4, 'User name must equal or more than 10 characters'],
        maxlength: [255, 'User name must equal or more than 255 characters'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [isEmail]
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 8,
        select: false //ẩn field password ở output khi request
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please provide confirm password'],
        minlength: 8,
        validate: {
            //only works on create() or save()
            validator: function (val) {
                return val === this.password;
            },
            message: 'Passwords do not match'
        }
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    //hash the password with cost of 12
    //method bcrypt này chống được brute force
    //add random string with length 12 to password then hash it
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        this.confirmPassword = undefined;//remove confirmPassword field
        return next();
    } catch (err) {
        return next(err);
    }
});

const User = mongoose.model('User', userSchema); //this is a model
module.exports = User;