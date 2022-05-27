const multer = require('multer');
const path = require('path');

const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB 限制
  },
  fileFilter (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      cb( new Error("檔案格式錯誤，圖片格式請上傳 JPG、JPEG 或 PNG") );
    }
    cb(null, true); // 就可以進下一個 middleware 
  },
}).any(); // 所有檔案都接收

module.exports = upload 