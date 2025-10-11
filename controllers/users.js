const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user");

userRouter.post("/", async (request, response, next) => {
    const { username, name, password } = request.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
        username,
        name,
        passwordHash,
    });
    try {
        const savedUser = await newUser.save();
        response.status(201).json(savedUser);
    } catch (error) {
        next(error);
    }
});

userRouter.get("/", async (request, response, next) => {
    try {
        const allUsers = await User.find({});
        response.json(allUsers);
    } catch (error) {
        next(error);
    }
});

module.exports = userRouter;
