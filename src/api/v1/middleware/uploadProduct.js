const multer = require("multer");
const path = require("path");

// Cấu hình storage
const storage = multer.diskStorage({
  destination: "./uploads/products", // Đường dẫn lưu ảnh
  filename: function (req, file, cb) {
    const ProductID = req.body.ProductID || Date.now();
    cb(null, ProductID + path.extname(file.originalname)); // Lưu ảnh với tên dựa trên ID sản phẩm
  },
});

const uploadProduct = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("ProductImage");

// Hàm kiểm tra loại tệp
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|webp|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

module.exports = uploadProduct;
