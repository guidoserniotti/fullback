const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user");

userRouter.post("/", async (request, response, next) => {
    const { username, name, password } = request.body;
    if (password.length < 3) {
        /*
         PASAR A MIDDLEWARE 
        */
        return response.status(400).json({
            error: "La contraseña debe tener 3 caracteres como mínimo.",
        });
    }
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
        /*
         CREAR ERROR DE VALIDACIÓN EN MIDDLEWARE
        */
        next(error);
    }
});

userRouter.get("/", async (request, response, next) => {
    try {
        const allUsers = await User.find({}).populate("blogs", {
            url: 1,
            author: 1,
            title: 1,
            likes: 1,
        });
        response.json(allUsers);
    } catch (error) {
        next(error);
    }
});

module.exports = userRouter;
