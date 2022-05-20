// express 錯誤處理

// 自己設定的 err 錯誤 
const resErrorProd = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      message: error.message,
    })
  } else {
    // log 紀錄
    console.error('出現重大錯誤', error)
    // 送出罐頭預設訊息
    res.status(500).json({
      status: 'false',
      message: '系統錯誤，請洽系統管理員',
    })
  }
}

// 開發環境錯誤
const resErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: 'false',
    message: error.message,
    error: error,
    stack: error.stack,
  })
}

module.exports = { resErrorProd, resErrorDev }