const router = require("./jwtAuth");
const authorization = require("../middleware/authorization");
const pool = require("../src/db");
const { json } = require("express");
const status = require("../services/status");

router.get("/home", authorization, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT user_name, user_email, user_phone FROM users WHERE user_id = $1",
      [req.user]
    );

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

router.get("/roles", authorization, async (req, res) => {
  try {
    const roles = await pool.query("SELECT * FROM roles");

    status.successMessage.data = roles.rows;

    res.status(status.status.success).json(status.successMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

module.exports = router;
