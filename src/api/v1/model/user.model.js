const db = require("../../../config/database.config");
const { promisify } = require("util");
const query = promisify(db.query).bind(db);

const Users = {
  registerSeller: async (
    id,
    UserFirstName,
    UserLastName,
    UserCity,
    UserCountry,
    UserAvatar,
    Role
  ) => {
    const sql_register_seller =
      "UPDATE users SET UserFirstName = ?, UserLastName = ?, UserCity = ?, UserCountry = ?, UserAvatar = ?, Role = ? WHERE UserID = ?";
    try {
      const result = await db.query(sql_register_seller, [
        UserFirstName,
        UserLastName,
        UserCity,
        UserCountry,
        UserAvatar,
        Role,
        id,
      ]);
      return result;
    } catch (error) {
      "Error executing query:", error;
      throw error;
    }
  },
  getAllUsers: async (userID) => {
    let sql_getUsers = "SELECT * FROM users ";
    try {
      if (userID) {
        sql_getUsers += "WHERE userID IS NULL OR userID !=  ? AND deleted = 0";
      } else {
        sql_getUsers += "WHERE deleted = 0";
      }
      const result = await query(sql_getUsers, [userID]);

      return result;
    } catch (error) {
      "Error executing query:", error;
      throw error;
    }
  },
  getUser: async (UserID) => {
    const sql_getUser = "SELECT * FROM users WHERE UserID = ?";
    try {
      const result = query(sql_getUser, [UserID]);
      return result;
    } catch (error) {
      "Error executing query:", error;
      throw error;
    }
  },
  updateUsers: async (
    userID,
    firstname,
    lastname,
    avatar,
    city,
    country, // Fixed typo 'coutry' to 'country'
    gender
  ) => {
    const sql_updateuser =
      "UPDATE users SET UserFirstName = ?, UserLastName = ?, UserCity = ?, UserCountry = ?, UserAvatar = ?, Gender = ? WHERE UserID = ?"; // Removed extra comma before 'WHERE'
    try {
      const result = await query(sql_updateuser, [
        firstname,
        lastname,
        city,
        country, // Fixed typo 'coutry' to 'country'
        avatar,
        gender,
        userID,
      ]);
      return result;
    } catch (error) {
      "Error executing query:", error;
      throw error;
    }
  },
};

module.exports = Users;
