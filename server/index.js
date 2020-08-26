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
app.use("/dashboard", require("./routes/dashboard"));

app.listen(5001, () => {
  console.log("Server is listening to port 5001");
});
