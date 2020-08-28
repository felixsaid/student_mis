const express = require("express");
const cors = require("cors");
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes

//user register and login route
app.use("/v1/auth", require("./routes/jwtAuth"));

//dashboard router
app.use("/v1/dashboard", require("./routes/dashboard"));

//courses route
app.use("/v1/courses", require("./routes/courses"));

app.listen(5001, () => {
  console.log("Server is listening to port 5001");
});
