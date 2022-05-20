const bcrypt = require('bcryptjs')
const validator = require('validator')
// const jwt = require('jsonwebtoken');

const User = require('../model/userModel')
const handleSuccess = require('../service/handleSuccess')
const handleErrorAsync = require('../service/handleErrorAsync')
const appError = require("../service/appError");

const { isAuth, generateSendJWT } = require('../service/auth');

const UserControllers = {
  // 取得所有使用者
  getUsers: handleErrorAsync(async (req, res, next) => {
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt"
    const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};
    const userData = await User.find(q).sort(timeSort);
    handleSuccess(res, userData);
  }),
  // 註冊
  signUp: handleErrorAsync(async (req, res, next) => {
    let { email, password, confirmPassword, name } = req.body;
    
    // 內容不可為空
    if (!email || !password || !confirmPassword || !name ) {
      return next(appError("400","欄位未填寫正確！", next));
    }
    // 密碼正確
    if (password !== confirmPassword) {
      return next(appError("400","密碼不一致！", next));
    }
    // 密碼至少 8 碼以上
    if (!validator.isLength(password,{ min:8 })) {
      return next(appError("400", "密碼字元至少 8 碼", next));
    }
    // 密碼需英數混合
    if (validator.isNumeric(password) || validator.isAlpha(password)) {
      return next(appError(400, '密碼需英文與數字混合', next))
    }
    // 是否為 Email 格式
    if (!validator.isEmail(email)) {
      return next(appError(400, 'Email 格式不正確', next));
    }
    // Email 是否已註冊過？
    const hasEmail = await User.findOne({ email })
    if ( hasEmail ) {
      return next(appError(400, '此 E-mail 已註冊過了', next))
    }

    // 將密碼加密
    bcryptPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      name,
      email,
      password: bcryptPassword,
    });
    
    generateSendJWT(newUser, 201, res); // 201: 請求成功且新的資源成功被創建
  }),
  // 登入
  signIn: handleErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(appError( 400,'帳號密碼不可為空', next));
    }

    const user = await User.findOne({ email }).select('+password');
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return next(appError(400, '您的帳號或密碼不正確', next));
    }
    generateSendJWT(user, 200, res);
  }),
  // 取得使用者資訊
  getProfile: handleErrorAsync(async (req, res, next) => {
    const userData = {
      user: req.user
    }

    handleSuccess(res, userData);
  }),
  // 更新使用者資料
  updateProfile: handleErrorAsync(async (req, res, next) => {
    const { _id } = req.user
    const { name, photo, gender } = req.body
    if (!name && !gender && !photo) {
      return next(appError(400, '請輸入正確的資訊', next))
    }
    const profileData = await User.findByIdAndUpdate( _id, { name, photo, gender }, { returnDocument: 'after' })

    handleSuccess(res, profileData);
  }),
  // 更新密碼
  updatePassword: handleErrorAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    // 密碼不可為空
    if (!password || !confirmPassword) {
      return next(appError(400, '欄位未正確填寫！', next))
    }
    // 密碼至少要 8 碼以上
    if (!validator.isLength(password, { min: 8 })) {
      return next(appError(400, '密碼字元至少 8 碼', next))
    }

    // 密碼需英數混合
    if (validator.isNumeric(password) || validator.isAlpha(password)) {
      return next(appError(400, '密碼需英文與數字混合', next))
    }

    if (password !== confirmPassword) {
      return next(appError(400, '密碼輸入不一致', next));
    }
  
    const newPassword = await bcrypt.hash(password, 12); // 新密碼
    
    const user = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword
    });
  
    generateSendJWT(user, 200, res)
  })
}

module.exports = UserControllers