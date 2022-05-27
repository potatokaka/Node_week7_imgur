const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');


// Router
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const uploadRouter = require('./routes/upload');

// Error Message
const { resErrorProd, resErrorDev } = require('./service/resError')

const app = express();

require('./connections')

// 程式出現重大錯誤時
process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception！')
  console.error(err);
  process.exit(1);
});

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/uploadImage', uploadRouter);

app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));

// 404 錯誤
app.use((req, res, next) => {
  res.status(404).send({
    status: 'false',
    message: '無此網路路由',
  })
})

// 錯誤處理
app.use(function (error, req, res, next) {
  // dev
  error.statusCode = error.statusCode || 500
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(error, res)
  }

  // production: mongoose 欄位錯誤
  if (error.name === 'ValidationError') {
    // 先取出欄位名稱
    let errorFiled = ''
    Object.keys(error.errors).forEach((item) => {
      errorFiled += item
    })

    error.message = `${errorFiled} 資料欄位未填寫正確，請重新輸入！`
    error.isOperational = true
    return resErrorProd(error, res)
  }
  resErrorProd(error, res)
})

// 未捕捉到的 catch 
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
  // 記錄於 log 上
});

module.exports = app;