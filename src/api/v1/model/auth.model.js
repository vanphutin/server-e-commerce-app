const db = require("../../../config/database.config");
const { promisify } = require("util");
const query = promisify(db.query).bind(db);
var md5 = require("md5");

const Auth = {
  // Checking username existence
  checkUsernameExists: async (username) => {
    const sql_check_username =
      "SELECT COUNT(*) AS count FROM users WHERE UserName = ?";
    try {
      const [rows] = await query(sql_check_username, [username]);
      // console.log("[rows]", rows.count);
      return rows.count > 0;
    } catch (error) {
      console.log("Error checking username existence:", error);
      throw error;
    }
  },

  // Checking email existence
  checkUseremailExists: async (useremail) => {
    const sql_check_useremail =
      "SELECT COUNT(*) AS count FROM users WHERE UserEmail = ?";
    try {
      const [rows] = await query(sql_check_useremail, [useremail]);
      return rows.count > 0;
    } catch (error) {
      co; // START REGISTERnsole.log("Error checking email existence:", error);
      throw error;
    }
  },

  // Register user
  authRegister: async (
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
  ) => {
    const sql_register =
      "INSERT INTO users (UserID, UserEmail, UserName, UserPassword, UserFirstName, UserLastName, UserCity, UserCountry, Gender, Birthday, Role,UserAvatar, authToken) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    try {
      const result = await query(sql_register, [
        UserID,
        UserEmail,
        UserName,
        md5(UserPassword),
        UserFirstName,
        UserLastName,
        UserCity,
        UserCountry,
        Gender,
        Birthday,
        Role,
        UserAvatar,
        authToken,
      ]);
      return result;
    } catch (error) {
      console.log("Error executing query:", error);
      throw error;
    }
  },
  // END REGISTER

  //===================================================

  //START LOGIN
  authCheckEmailPass: async (UserEmail, UserPassword) => {
    const sql_email_pass =
      "SELECT COUNT(*) AS count FROM users WHERE UserEmail = ? AND UserPassword = ?";
    try {
      const [results] = await query(sql_email_pass, [UserEmail, UserPassword]);
      return results.count > 0;
    } catch (error) {
      console.log("Error executing query:", error);
      throw error;
    }
  },
  authLogin: async (UserEmail, UserPassword) => {
    const sql_login =
      "SELECT * FROM users WHERE UserEmail=? AND UserPassword=?";
    try {
      const result = await query(sql_login, [UserEmail, md5(UserPassword)]);
      // console.log("result", result);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.log("Lỗi khi thực hiện truy vấn:", error);
      throw error; // Ném lỗi để controller hoặc route bắt được và xử lý
    }
  },
  authVeryToken: async (UserEmail) => {
    const sql_veryToken = "SELECT * FROM users WHERE UserEmail = ?";
    try {
      const result = await query(sql_veryToken, [UserEmail]);
      return result && result.length > 0 ? result[0] : null;
    } catch (error) {
      console.log("Lỗi khi thực hiện truy vấn:", error);
      throw error;
    }
  },
  //END LOGIN
};

module.exports = Auth;
