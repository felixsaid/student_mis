const router = require("express").Router();
const pool = require("../src/db");
const authorization = require("../middleware/authorization");
const status = require("../services/status");

router.get("/courses", authorization, async (req, res) => {
  try {
    const student_courses = await pool.query(
      "SELECT s.student_id, s.first_name, s.last_name, s.student_number, s.registration_date, s.student_status, json_build_object('course_id', c.course_id, 'course_name', c.course_name, 'course_status', c.course_status, 'enroll_date', e.enroll_date, 'end_date', e.end_date, 'status', e.status) as courses FROM students s INNER JOIN student_courses e USING (student_id) INNER JOIN courses c USING (course_id)"
    );

    if (student_courses.rows.length === 0) {
      res.status(401).json("No course allocations were found in the system.");
    } else {
      status.successMessage.data = student_courses.rows;
      status.successMessage.content = "students/courses";
      status.successMessage.version = "api v1 test/env";

      res.status(status.status.success).json(status.successMessage);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
});

router.get("/:student_id/courses", authorization, async (req, res) => {
  try {
    const { student_id } = req.params;

    const student_courses = await pool.query(
      "SELECT s.student_id, s.first_name, s.last_name, s.student_number, s.registration_date, s.student_status, json_build_object('course_id', c.course_id, 'course_name', c.course_name, 'course_status', c.course_status, 'enroll_date', e.enroll_date, 'end_date', e.end_date, 'status', e.status) as courses FROM students s INNER JOIN student_courses e USING (student_id) INNER JOIN courses c USING (course_id) WHERE e.student_id = $1",
      [student_id]
    );

    if (student_courses.rows.length === 0) {
      res
        .status(401)
        .json(
          `No course allocations were found for the student with ID ${student_id}`
        );
    } else {
      status.successMessage.data = student_courses.rows;
      status.successMessage.content = `students/${student_id}/courses`;
      status.successMessage.version = "api v1 test/env";

      res.status(status.status.success).json(status.successMessage);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
});

module.exports = router;
