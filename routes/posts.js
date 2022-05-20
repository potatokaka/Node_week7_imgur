const express = require('express')
const router = express.Router()
const PostControllers = require('../controllers/posts')
const { isAuth } = require('../service/auth')

router.get('/', isAuth, PostControllers.getPosts);
router.post('/', isAuth, PostControllers.createPost);

router.delete('/', isAuth, PostControllers.deletePosts);
router.delete('/:id', isAuth, PostControllers.deletePost);
router.patch('/:id', isAuth, PostControllers.updatePost);

module.exports = router;