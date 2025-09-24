require("dotenv").config();

const URL = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3003;

module.exports = { URL, PORT };
