const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASS,
  options: "-c default_transaction_read_only=off",
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
