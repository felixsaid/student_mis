const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  database: "studentmisdb",
  port: 5432,
});

module.exports = pool;
