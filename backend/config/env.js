const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const { PORT, NODE_ENV, JWT_SECRET, JWT_EXPIRES_IN, DATABASE_URL } =
  process.env;

module.exports = {
  PORT,
  NODE_ENV,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  DATABASE_URL,
};
