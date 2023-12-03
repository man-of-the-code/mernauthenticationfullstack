const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
require("./db/conn.js");
const cors = require("cors");
const router = require("./routes/router.js");
const cookieparser = require("cookie-parser");

const app = express();

//applying cors policy
app.use(cors());
//body parsing
app.use(express.json());
//loading routes
app.use(router);
//cookie-parsing
app.use(cookieparser());

app.get("/", (req, res) => {
  res.status(201).json("server created");
});

app.listen(process.env.PORT, () => {
  console.log(`server started at port number : ${process.env.PORT}`);
});
