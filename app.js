require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const { URL } = require("./utils/config");

const blogRouter = require("./controllers/blog");

mongoose.connect(URL);

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogRouter);

module.exports = app;
