const handleSuccess = require('../service/handleSuccess')
// const handleError = require('../service/handleError')
const Post = require('../model/postModel')
const User = require('../model/userModel')

const handleErrorAsync = require('../service/handleErrorAsync')
const appError = require("../service/appError");

const PostControllers = {
  getPosts: handleErrorAsync(async (req, res, next) => {
    /**
    * #swagger.tags = ['Posts 貼文']
    */
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt"
    const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};
    const postData = await Post.find(q).populate({
      path: 'user',
      select: 'name photo'
    }).sort(timeSort);
    handleSuccess(res, postData);
  }),
  createPost: handleErrorAsync(async (req, res, next) => {
    /**
     * #swagger.tags = ['Posts - 貼文']
    */
    const { content } = req.body
      if ( content ) {
        const newPost = await Post.create({
          user: req.user.id,
          content
        })
        handleSuccess(res, newPost)
      } else {
        return next(appError(400, '請填寫 content 資料，此欄位必填', next))
      }
  }),
  deletePosts: handleErrorAsync(async (req, res, next) => {
    /**
     * #swagger.tags = ['Posts - 貼文']
    */
    await Post.deleteMany({});
    const postData = await Post.find();
    handleSuccess(res, postData)
  }),
  deletePost: handleErrorAsync(async (req, res, next) => {
    /**
     * #swagger.tags = ['Posts - 貼文']
    */
    const { id } = req.params
    const postData = await Post.findByIdAndDelete(id);

    postData == null ? next(appError(400, "無此貼文 id", next)) : handleSuccess(res, postData)
  }),
  updatePost: handleErrorAsync(async (req, res, next) => {
    /**
     * #swagger.tags = ['Posts - 貼文']
    */
    const { id } = req.params
    const { body } = req
    const postData = await Post.findByIdAndUpdate(
      id, 
      {
        name: body.name,
        content: body.content,
        image: body.image,
        type: body.tags,
        tags: body.type
      }
    )
    postData == null ? next(appError(400, "無此貼文 id", next)) : handleSuccess(res, postData)
  })
}

module.exports = PostControllers