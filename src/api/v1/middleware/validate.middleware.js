const Auth = require("../model/auth.model");
const multer = require("multer");
const upload = multer(); // Cấu hình multer để xử lý form-data

const validateRegister = async (req, res, next) => {
  const {
    UserEmail,
    UserName,
    UserPassword,
    UserFirstName,
    UserLastName,
    UserCity,
    UserCountry,
    Gender,
    Birthday,
    UserAvatar,
    Role,
  } = req.body;

  // Kiểm tra các trường yêu cầu
  const requiredFields = [
    "UserFirstName",
    "UserLastName",
    "UserCity",
    "UserCountry",
    "Birthday",
    "UserName",
    "UserPassword",
    "UserEmail",
    "Role",
    "Gender",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res
        .status(400)
        .json({ error: `Missing required field: ${field}` });
    }
  }

  // Kiểm tra sự tồn tại của username và email
  const usernameExists = await Auth.checkUsernameExists(UserName);
  if (usernameExists) {
    return res.status(400).json({ error: "Username already exists" });
  }

  const useremailExists = await Auth.checkUseremailExists(UserEmail);
  if (useremailExists) {
    return res.status(400).json({ error: "UserEmail already exists" });
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (UserEmail.length > 254 || !emailRegex.test(UserEmail)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  // Validate username
  const nameRegex = /^[a-zA-Z\-]+$/;
  if (!nameRegex.test(UserName)) {
    return res.status(400).json({ error: "Invalid username" });
  }

  // Đặt giá trị mặc định cho Role và UserAvatar
  req.body.Role = Role || "user";
  req.body.UserAvatar = UserAvatar || "no image";

  next();
};

const validateLogin = async (req, res, next) => {
  const { UserEmail, UserPassword } = req.body;

  const check_email_pass = await Auth.authCheckEmailPass(
    UserEmail,
    UserPassword
  );
  if (check_email_pass) {
    return res
      .status(400)
      .json({ error: "UserEmail or UserPassword already exists" });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};
