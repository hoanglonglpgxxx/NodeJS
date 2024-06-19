const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router.use(authController.protect);//do middleware có tính tuần tự, nên phải đặt protect ở đây thì các route dưới được protect

router.patch('/update-password', authController.updatePassword);
router.patch(
    '/update-data',
    userController.uploadUserImg,
    userController.resizeUserPhoto,
    userController.updateData
);

router.delete('/delete-self', userController.deleteSelf);
router.get(
    '/me',
    userController.getMe,
    userController.getUser
);
//thiếu updateMe

router.use(authController.restrictRole('admin'));

router
    .route('/')
    .get(userController.getAllUsers);
// .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;