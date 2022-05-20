var express = require('express');
var router = express.Router();
const UserControllers = require('../controllers/users')
const { isAuth } = require('../service/auth')

router.get('/', UserControllers.getUsers);

router.post('/sign_up', UserControllers.signUp);
router.post('/sign_in', UserControllers.signIn);

router.get('/profile', isAuth, UserControllers.getProfile);
router.patch('/profile', isAuth, UserControllers.updateProfile);
router.patch('/updatePassword', isAuth, UserControllers.updatePassword);

module.exports = router;