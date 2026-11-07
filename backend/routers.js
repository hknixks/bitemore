const express = require('express');
const { signup, login, authorization, updateUserProfile, password } = require('./controller/userController');
const { addToCart, deleteItem, getUserCart, increaseQuantity, decreaseQuantity, makingPayment, getUserHistory } = require('./controller/Cartcontroller');
const { sendResetEmail, resetPassword, verifyOTP } = require('./controller/ResetPassword');
const { adminLogin, adminSignup, adminAuthorization } = require('./controller/AdminController');
const { adminUpload, getNewOrder, acceptOrder, declineOrder, adminGetFood, removeFood, getAllOrderHistory } = require('./controller/AdminCart');
const { upload } = require('./packages');
const { requireUser, requireAdmin } = require('./middleware/auth');
const { authLimiter, otpLimiter } = require('./middleware/rateLimiters');

const router = express.Router();

// ---- public ----
router.get('/api', adminGetFood);                       // the menu

router.post('/userSignup', authLimiter, signup);
router.post('/userLogin', authLimiter, login);
router.post('/adminLogin', authLimiter, adminLogin);
router.post('/adminSignup', authLimiter, adminSignup);

// password reset by emailed code
router.post('/userResetpassword', otpLimiter, sendResetEmail);
router.post('/userVerifyOTP', otpLimiter, verifyOTP);
router.post('/userForgotPin', otpLimiter, resetPassword);
router.post('/forgotPin', otpLimiter, resetPassword);

// ---- logged-in customer ----
router.get('/userAuthorization', requireUser, authorization);
router.patch('/updateUserProfile/:_id', requireUser, upload.single('profileImage'), updateUserProfile);
router.patch('/password/:_id', requireUser, password);

router.post('/userCart', requireUser, addToCart);
router.get('/getUserCart/:userId', requireUser, getUserCart);
router.delete('/deleteUserItem/:_id', requireUser, deleteItem);
router.put('/cart/increaseQuantity/:itemId', requireUser, increaseQuantity);
router.put('/cart/decreaseQuantity/:itemId', requireUser, decreaseQuantity);

router.post('/makingPayment', requireUser, makingPayment);
router.get('/getUserHistory/:_id', requireUser, getUserHistory);

// ---- admin only ----
router.get('/adminAuthorization', requireAdmin, adminAuthorization);
router.post('/adminUpload', requireAdmin, upload.single('profileImage'), adminUpload);
router.delete('/removeFood/:_id', requireAdmin, removeFood);
router.get('/getNewOrder', requireAdmin, getNewOrder);
router.get('/getAllUserHistory', requireAdmin, getAllOrderHistory);
router.post('/acceptOffer', requireAdmin, acceptOrder);
router.post('/declineOffer', requireAdmin, declineOrder);

module.exports = router;
