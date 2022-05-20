// 自定義的錯誤回饋
const appError = (httpStatus, errorMessage, next) => {
  const error = new Error(errorMessage)
  error.statusCode = httpStatus
  error.isOperational = true
  next(error);
}

module.exports = appError;