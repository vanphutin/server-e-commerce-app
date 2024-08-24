const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const Auth = require("../../v1/model/auth.model");
const db = require("../../../config/database.config");
const { promisify } = require("util");
const query = promisify(db.query).bind(db);

module.exports.authRegister = async (req, res) => {
  const UserID = uuidv4();
  try {
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

    const secretKey = "vanphutin-2004-29-02";
    const authToken = jwt.sign({ UserID, UserEmail, UserPassword }, secretKey, {
      expiresIn: "1h",
    });

    const register = await Auth.authRegister(
      UserID,
      UserEmail,
      UserName,
      UserPassword,
      UserFirstName,
      UserLastName,
      UserCity,
      UserCountry,
      Gender,
      Birthday,
      Role,
      UserAvatar,
      authToken
    );

    res.status(201).json({
      code: 201,
      message: "User registration successful",
      authToken,
    });
  } catch (error) {
    console.error("Error processing registration:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports.authLogin = async (req, res) => {
  try {
    const { UserEmail, UserPassword } = req.body;
    // console.log("req.body", req.body);
    const loginAuth = await Auth.authLogin(UserEmail, UserPassword);
    if (!loginAuth) {
      return res.status(400).json({
        code: 400,
        message: "Email or Password is not valid",
      });
    }
    const secretKey = "vanphutin-2004-29-02";
    const authToken = jwt.sign(
      {
        UserEmail: loginAuth.UserEmail,
        UserPassword: loginAuth.UserPassword,
      },
      secretKey,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", authToken, { httpOnly: true });
    await db.query("UPDATE users SET authToken = ? WHERE UserID = ?", [
      authToken,
      loginAuth.UserID,
    ]);

    //return list products
    const listProducts = await query(
      `
      SELECT p.*, c.CategoryName
      FROM products p
      JOIN productcategories c ON p.ProductCategoryID = c.CategoryID
      WHERE p.UserID = ?
    `,
      [loginAuth.UserID]
    );
    res.status(200).json({
      code: 200,
      message: "Login successful",
      data: {
        id: loginAuth.UserID,
        username: loginAuth.UserName,
        lastname: loginAuth.UserLastName,
        firstname: loginAuth.UserFirstName,
        useremail: loginAuth.UserEmail,
        avatar: loginAuth.UserAvatar,
        address: {
          city: loginAuth.UserCity,
          country: loginAuth.UserCountry,
        },
        gender: loginAuth.Gender,
        birthday: loginAuth.Birthday,
        role: loginAuth.Role,
        delete: loginAuth.Deleted,
        createAt: loginAuth.createAt,
        products: listProducts,
      },
      token: loginAuth.authToken,
    });
  } catch (error) {
    console.error("Error processing registration:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports.authVeryToken = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const secretKey = "vanphutin-2004-29-02";
    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Failed to authenticate token" });
      }

      // console.log("decoded.userId:", decoded);
      // Giả sử bạn có hàm này để lấy thông tin người dùng từ ID
      const loginAuth = await Auth.authVeryToken(decoded?.UserEmail);
      // console.log("user:", loginAuth);

      if (!loginAuth) {
        return res.status(404).json({ message: "User not found" });
      }
      //return list products
      const listProducts = await query(
        `
      SELECT p.*, c.CategoryName
      FROM products p
      JOIN productcategories c ON p.ProductCategoryID = c.CategoryID
      WHERE p.UserID = ?  AND p.Deleted = 0
    `,
        [loginAuth.UserID]
      );

      res.status(200).json({
        code: 200,
        message: "Login successful",

        user: {
          id: loginAuth.UserID,
          username: loginAuth.UserName,
          lastname: loginAuth.UserLastName,
          firstname: loginAuth.UserFirstName,
          useremail: loginAuth.UserEmail,
          address: {
            city: loginAuth.UserCity,
            country: loginAuth.UserCountry,
          },
          gender: loginAuth.Gender,
          birthday: loginAuth.Birthday,
          role: loginAuth.Role,
          delete: loginAuth.Deleted,
          createAt: loginAuth.createAt,
          avatar: loginAuth.UserAvatar,
          products: listProducts,
        },
        token: loginAuth.authToken,
      });
    });
  } catch (error) {
    console.error("Error in authVeryToken:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
