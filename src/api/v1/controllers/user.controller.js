const User = require("../model/user.model");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const Users = require("../model/user.model");

module.exports.registerSeller = async (req, res) => {
  try {
    const { id, UserFirstName, UserLastName, UserCity, UserCountry } = req.body;
    const Role = "seller";

    // If a file is uploaded
    let UserAvatar = null;
    if (req.file) {
      UserAvatar = req.file.path.replace(/\\/g, "/"); // Lưu đường dẫn ảnh
    }

    if (
      !id ||
      !UserFirstName ||
      !UserLastName ||
      !UserCity ||
      !UserCountry ||
      !UserAvatar
    ) {
      return res.status(400).json({
        code: 400,
        message: "Missing required fields",
      });
    }

    const userSeller = await User.registerSeller(
      id,
      UserFirstName,
      UserLastName,
      UserCity,
      UserCountry,
      UserAvatar,
      Role
    );

    if (!userSeller) {
      return res.status(400).json({
        code: 400,
        message: "Error updating user",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Update user seller successful",
    });
  } catch (error) {
    console.log("Error executing query:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};
module.exports.createProducts = async (req, res) => {
  const ProductID = uuidv4();
  try {
    const {
      ProductName,
      ProductPrice,
      ProductWeight,
      ProductLongDesc,
      ProductImage,
      ProductCategoryID,
      ProductStock,
      UserID,
    } = req.body;
  } catch (error) {
    console.log("Error executing query:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

module.exports.getAllUsers = async (req, res) => {
  const { userID } = req.query;

  try {
    const getUser = await User.getAllUsers(userID);
    if (getUser.length <= 0) {
      return res.status(400).json({
        code: 404,
        message: "Don't find user !",
      });
    }

    // Tạo dữ liệu người dùng
    const users = getUser.map((user) => ({
      id: user.UserID,
      avatar: user.UserAvatar,
      username: user.UserName,
      city: user.UserCity,
      country: user.UserCountry,
      lastname: user.UserLastName,
      firstname: user.UserFirstName,
      email: user.UserEmail,
      gender: user.Gender,
      role: user.Role,
      birthday: user.Birthday,
    }));
    console.log("role: user.role,", users);

    res.status(200).json({
      code: 200,
      message: "Users retrieved successfully",
      data: users, // Trả về danh sách người dùng
    });
  } catch (error) {
    console.log("Error executing query:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

module.exports.getUser = async (req, res) => {
  const UserID = req.params.id;
  if (!UserID) {
    return res.status(400).json({
      code: 400,
      message: "Missing id",
    });
  }
  try {
    const getUserDetail = await User.getUser(UserID);
    if (getUserDetail.length <= 0) {
      return res.status(400).json({
        code: 400,
        message: "Don't find user",
      });
    }
    const user = getUserDetail[0];
    return res.status(200).json({
      code: 200,
      message: "Get user success",
      data: {
        id: user.UserID,
        avatar: user.UserAvatar,
        username: user.UserName,
        city: user.UserCity,
        country: user.UserCountry,
        lastname: user.UserLastName,
        firstname: user.UserFirstName,
        email: user.UserEmail,
        gender: user.Gender,
        role: user.role,
        birthday: user.birthday,
      },
    });
  } catch (error) {
    console.log("Error executing query:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

module.exports.updateUsers = async (req, res) => {
  const { firstname, lastname, city, country, gender, userID } = req.body; // Fixed typo 'coutry' to 'country'
  let avatar = null;

  if (req.file) {
    avatar = req.file.path.replace(/\\/g, "/"); // Normalize the file path
  }

  const missingFields = [];

  if (!userID) missingFields.push("userID");
  if (!firstname) missingFields.push("firstname");
  if (!lastname) missingFields.push("lastname");
  if (!city) missingFields.push("city");
  if (!country) missingFields.push("country");
  if (!gender) missingFields.push("gender");

  if (missingFields.length > 0) {
    return res.status(400).json({
      code: 400,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const update = await Users.updateUsers(
      userID,
      firstname,
      lastname,
      avatar,
      city,
      country, // Fixed typo 'coutry' to 'country'
      gender
    );
    if (!update) {
      return res.status(400).json({
        code: 400,
        message: "Error updating user",
      });
    }
    return res.status(200).json({
      code: 200,
      message: "Update user successful",
    });
  } catch (error) {
    console.log("Error executing query:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};
