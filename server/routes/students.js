const pool = require("../src/db");
const router = require("express").Router();
const authorization = require("../middleware/authorization");
const status = require("../services/status");
const moment = require("moment");

//get all students

router.get("/", authorization, async (req, res) => {
  try {
    const students = await pool.query(
      "SELECT s.student_id, s.first_name, s.last_name, s.student_number, s.registration_date, s.student_status, json_build_object('user_name', u.user_name, 'user_email', u.user_email,'user_phone', u.user_phone) as user FROM students s INNER JOIN users u USING(user_id)"
    );

    status.successMessage.data = students.rows;
    status.successMessage.content = "all students";
    status.successMessage.version = "api v1 test/env";

    res.status(status.status.success).json(status.successMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

//get student by student id

router.get("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;

    const student = await pool.query(
      "SELECT s.student_id, s.first_name, s.last_name, s.student_number, s.registration_date, s.student_status, json_build_object('user_name', u.user_name, 'user_email', u.user_email, 'user_phone', u.user_phone) as user FROM students s INNER JOIN users u USING(user_id) WHERE student_id = $1",
      [id]
    );

    status.successMessage.data = student.rows[0];
    status.successMessage.content = `student with id ${id}`;
    status.successMessage.version = "api v1 test/env";

    res.status(status.status.success).json(status.successMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

//get student by student number

router.post("/studentnumber", authorization, async (req, res) => {
  try {
    const { student_number } = req.body;

    const student = await pool.query(
      "SELECT s.student_id, s.first_name, s.last_name, s.student_number, s.registration_date, s.student_status, json_build_object('user_name', u.user_name, 'user_email', u.user_email, 'user_phone', u.user_phone) as user FROM students s INNER JOIN users u USING(user_id) WHERE student_number = $1",
      [student_number]
    );

    if (student.rows[0].length === 0) {
      res
        .status(401)
        .json(`Student with student number ${student_number} was not found!`);
    } else {
      status.successMessage.data = student.rows[0];
      status.successMessage.content = `student with student number ${student_number}`;
      status.successMessage.version = "api v1 test/env";
      res.status(status.status.success).json(status.successMessage);
    }
  } catch (err) {
    console.error(err.message);
  }
});

//create a new student

router.post("/create", authorization, async (req, res) => {
  try {
    const { first_name, last_name, student_status } = req.body;

    const createdDate = moment(new Date());
    const userId = req.user;

    //sample student number: STUD/2018/0001

    const regNumber = await pool.query(
      "SELECT registration_date, student_number FROM students ORDER BY registration_date DESC LIMIT 1"
    );
    let newStudentNumber = 0;
    var currentYear = new Date().getFullYear();

    if (regNumber.rows.length === 0) {
      newStudentNumber = `STUD-${currentYear}/1`;
    } else {
      const studentNum = regNumber.rows[0].student_number;

      let recentStudentNumber = studentNum.split("/").pop();
      const newNum = parseFloat(recentStudentNumber) + 1;

      newStudentNumber = `STUD-${currentYear}/${newNum}`;
    }

    const newStudent = await pool.query(
      "INSERT INTO students(first_name, last_name, student_number, registration_date, student_status, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        first_name,
        last_name,
        newStudentNumber,
        createdDate,
        student_status,
        userId,
      ]
    );

    status.successMessage.data = newStudent.rows[0];
    status.successMessage.content = "Student created successfully!";
    status.successMessage.version = "api v1 test/env";

    res.status(status.status.success).json(status.successMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
