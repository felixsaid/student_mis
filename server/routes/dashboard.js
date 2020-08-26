const router = require("./jwtAuth");
const authorization = require("../middleware/authorization");
const pool = require("../src/db");
const { json } = require("express");

router.get("/", authorization, async (req, res) => {
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

module.exports = router;
