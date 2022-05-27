var express = require('express');
var router = express.Router();

const { isAuth } = require('../service/auth')
const checkImageUpload = require('../service/imageUpload');
const UploadControllers = require('../controllers/upload')

router.post('/', isAuth, checkImageUpload, UploadControllers.uploadImage);

module.exports = router;