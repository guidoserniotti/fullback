require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const { URL } = require("./utils/config");

const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");

mongoose.connect(URL);

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);

module.exports = app;
