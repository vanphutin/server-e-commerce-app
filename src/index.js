const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8080;
const database = require("./config/database.config");
const apiRoutersV1 = require("./api/v1/routers/index.router");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Cookie parser
app.use(cookieParser());

// CORS configuration
const whitelist = [
  "https://vpt-quiz-app.netlify.app",
  "https://vpt-e-commerce-app-9413c5e93166.herokuapp.com",
  "http://localhost:3000",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      // Allow no origin for testing purposes or in case of no origin
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies to be sent with CORS requests
};
app.use(cors(corsOptions));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// APIs
apiRoutersV1(app);

// Database connection and server start
database.getConnection((error, connection) => {
  if (error) {
    console.error("Error connecting to database:", error);
    return;
  }
  "Connected to MySQL database",
    `host: ${database.config.connectionConfig.host}, port: ${database.config.connectionConfig.port}`;
  connection.release();
  app.listen(port, () => {
    `App listening on port ${port}`;
  });
});

// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
