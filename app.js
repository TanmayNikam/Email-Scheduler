require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const mailRouter = require("./routes/mails");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api", mailRouter);

module.exports = app;
