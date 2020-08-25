const pool = require("../src/db");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const moment = require("moment");
const jwtGenerator = require("../utils/jwtGenerator");
const { json } = require("express");
const ValidInfo = require("../middleware/ValidInfo");
const authorization = require("../middleware/authorization");
moment().format();

//register route
router.post("/register", ValidInfo, async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;

    //check if user exists

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    if (user.rows.length !== 0) {
      res.status(401).json(`user with email ${email} exists in the system!`);

      exit();
    }

    //bcrypt the user password

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const dtcreated = moment().toISOString();

    //send user to the database

    const createUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_phone, user_role, user_password, datecreated, accountstatus) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, email, phone, role, bcryptPassword, dtcreated, "active"]
    );

    //generate token

    const token = jwtGenerator(createUser.rows[0].user_id);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

//login router

router.post("/login", ValidInfo, async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user exists
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      res.status(401).json(`User with email ${email} was not found!`);
    }

    //check if password matches the password provided
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      res.status(401).json("Email or password is incorrect");
    }

    //give token

    const token = jwtGenerator(user.rows[0].user_id);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server errror");
  }
});

//verification route

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

module.exports = router;
