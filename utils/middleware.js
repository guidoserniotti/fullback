var morgan = require("morgan");
const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("./config");

morgan.token("content", function getContent(req) {
    return JSON.stringify(req.body);
});

const tokenExtractor = (request, response, next) => {
    const authHeader = request.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.replace("Bearer ", "");
        // Solo asignar el token si no está vacío
        if (token && token.trim() !== "") {
            request.token = token;
        }
    }
    next();
};

const userExtractor = async (request, response, next) => {
    try {
        if (!request.token || request.token.trim() === "") {
            throw { name: "JsonWebTokenError", message: "token missing" };
        }

        const userFromToken = jwt.verify(request.token, config.SECRET);
        if (!userFromToken.id) {
            throw { name: "JsonWebTokenError", message: "token invalid" };
        }
        request.user = await User.findById(userFromToken.id);
        next();
    } catch (error) {
        next(error);
    }
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    } else if (error.name === "MongoServerError" && error.code === 11000) {
        return response.status(400).json({
            error: "Este nombre de usuario ya está siendo utilizado.",
        });
    } else if (error.name === "JsonWebTokenError") {
        return response.status(401).json({ error: error.message });
    } else if (error.name === "TokenExpiredError") {
        return response.status(401).json({
            error: "token expired",
        });
    }

    next(error);
};

module.exports = {
    morgan,
    tokenExtractor,
    userExtractor,
    unknownEndpoint,
    errorHandler,
};
