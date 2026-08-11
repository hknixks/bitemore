const express = require('express');
const { signup, login, authorization, updateUserProfile, password } = require('./controller/userController');
const { apiFuction } = require('./controller/Api');
const { addToCart, getCartItem, deleteItem, getUserCart, increaseQuantity, decreaseQuantity, makingPayment, getUserHistory } = require('./controller/Cartcontroller');
const { sendResetEmail, resetPassword, verifyOTP } = require('./controller/ResetPassword');
const { adminLogin, adminSignup, adminAuthorization } = require('./controller/AdminController');
const { adminUpload, getNewOrder, acceptOrder, declineOrder, adminGetFood, removeFood, getAllOrderHistory } = require('./controller/AdminCart');
const { upload } = require('./packages');

const router = express.Router();

router.use(express.json());

// user router
router.post('/userSignup', signup);
router.post('/userLogin', login);
router.get('/userAuthorization', authorization);
router.post('/userResetpassword', sendResetEmail);
router.post('/userForgotPin', resetPassword)
router.post('/userVerifyOTP', verifyOTP);
router.post('/userForgotPin', sendResetEmail);
router.post('/userCart', addToCart);
router.delete('/deleteUserItem/:_id', deleteItem);
router.put('/cart/increaseQuantity/:itemId', increaseQuantity);
router.put('/cart/decreaseQuantity/:itemId', decreaseQuantity);
router.get('/getUserCart/:userId', getUserCart);
router.post('/makingPayment', makingPayment);
router.patch('/updateUserProfile/:_id', upload.single('profileImage'), updateUserProfile);
router.patch('/password/:_id', password);
router.get('/getUserHistory/:_id', getUserHistory);
router.get('/getAllUserHistory', getAllOrderHistory)

router.post('/forgotPin', resetPassword)

router.get('/api', adminGetFood);
router.delete("/removeFood/:_id", removeFood);




// admin router
router.post('/adminLogin', adminLogin);
router.post('/adminSignup', adminSignup);
router.get('/adminAuthorization', adminAuthorization);
router.post('/adminUpload', upload.single('profileImage'), adminUpload);
router.get('/getNewOrder', getNewOrder);
router.post('/acceptOffer', acceptOrder);
router.post('/declineOffer', declineOrder);

module.exports = router;