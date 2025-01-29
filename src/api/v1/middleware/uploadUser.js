const multer = require("multer");

// Sử dụng memoryStorage để lưu file tạm trong bộ nhớ
const storage = multer.memoryStorage();

const uploadUser = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // Giới hạn dung lượng 5MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("UserAvatar");

// Hàm kiểm tra loại file
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|webp|png|gif/;
  const extname = filetypes.test(file.originalname.toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Only images are allowed!");
  }
}

module.exports = uploadUser;
