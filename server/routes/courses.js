const authorization = require("../middleware/authorization");
const pool = require("../src/db");
const status = require("../services/status");
const moment = require("moment");

const router = require("express").Router();

router.get("/", authorization, async (req, res) => {
  try {
    // const courses = await pool.query("SELECT * FROM courses");

    const courses2 = await pool.query(
      "SELECT c.course_id, c.course_name, c.course_status, json_build_object('user_name', u.user_name, 'user_email', u.user_email, 'user_phone', u.user_phone) as user FROM courses c INNER JOIN users u USING(user_id)"
    );

    status.successMessage.data = courses2.rows;
    status.successMessage.content = "all courses";
    status.successMessage.version = "api v1 test/env";

    res.status(status.status.success).json(status.successMessage);
  } catch (err) {
    console.error(err.message);
    res.status(status.status.error).json("Server error");
  }
});

router.get("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;

    const courses = await pool.query(
      "SELECT c.course_id, c.course_name, c.course_status, json_build_object('user_name', u.user_name, 'user_email', u.user_email, 'user_phone', u.user_phone) as user FROM courses c INNER JOIN users u USING(user_id) WHERE course_id = $1",
      [id]
    );

    status.successMessage.data = courses.rows[0];
    status.successMessage.content = `course by course id: ${id}`;
    status.successMessage.version = "api v1 test/env";

    res.status(status.status.success).json(status.successMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

router.post("/create", authorization, async (req, res) => {
  try {
    const { course_name, course_status } = req.body;

    const dtcreated = moment(new Date());
    const userId = req.user;

    if (course_name === "" || course_status === "") {
      status.errorMessage.error =
        "Course name or course status cannot be empty!";
      res.status(400).json(status.errorMessage);
    } else {
      const createUser = await pool.query(
        "INSERT INTO courses (course_name, course_status, date_created, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [course_name, course_status, dtcreated, userId]
      );

      status.successMessage.data = createUser.rows[0];
      status.successMessage.content = "course created";
      status.successMessage.version = "api v1 test/env";

      res.status(status.status.success).json(status.successMessage);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

router.delete("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;

    const user = await pool.query(
      "SELECT user_name, role_name FROM users JOIN roles ON users.user_role = roles.role_id WHERE user_id = $1",
      [userId]
    );

    if (user.rows[0].role_name !== "Admin") {
      status.errorMessage.error =
        "You don't have the rights to delete a course!";
      res.status(400).json(status.errorMessage);
    } else {
      const delCourse = await pool.query(
        "DELETE FROM courses WHERE course_id = $1",
        [id]
      );

      // status.successMessage.success = "Course was deleted successfully!";
      res.status(status.status.created).json("Course was deleted successfully");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

router.put("/update/:id", authorization, async (req, res) => {
  const { id } = req.params;
  const userId = req.user;
  const { course_name, course_status } = req.body;

  try {
    const user = await pool.query(
      "SELECT user_name, role_name FROM users JOIN roles ON users.user_role = roles.role_id WHERE user_id = $1",
      [userId]
    );

    if (user.rows[0].role_name !== "Admin") {
      status.errorMessage.error =
        "You don't have the rights to update course details!";
      res.status(400).json(status.errorMessage);
    } else {
      const updateCourse = await pool.query(
        "UPDATE courses SET course_name = $1, course_status = $2 WHERE course_id = $3",
        [course_name, course_status, id]
      );
    }
    // status.successMessage.success = "Course was deleted successfully!";
    res.status(status.status.created).json("Course was updated successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

module.exports = router;
