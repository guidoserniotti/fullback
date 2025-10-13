var morgan = require("morgan");

morgan.token("content", function getContent(req) {
    return JSON.stringify(req.body);
});

const tokenExtractor = (request, response, next) => {
    const authHeader = request.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        request.token = authHeader.replace("Bearer ", "");
    }
    next();
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
    } else if (
        error.name === "MongoServerError" &&
        error.message.includes("E11000 duplicate key error")
    ) {
        return response
            .status(400)
            .json({ error: "expected `username` to be unique" });
    } else if (error.name === "JsonWebTokenError") {
        return response.status(401).json({ error: "token invalid" });
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
    unknownEndpoint,
    errorHandler,
};
