const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: "./uploads/avatars", // Sửa đường dẫn đến thư mục uploads/avatars
  filename: function (req, file, cb) {
    const UserAvatar = req.body.UserAvatar || Date.now();
    cb(null, UserAvatar + path.extname(file.originalname)); // Lưu ảnh với tên dựa trên ID sản phẩm
  },
});

// Initialize upload variable
const uploadUser = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("UserAvatar"); // "UserAvatar" là tên trường trong form

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|webp|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

module.exports = uploadUser;
