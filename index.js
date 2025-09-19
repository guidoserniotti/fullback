require("dotenv").config();
const date = new Date();
const express = require("express");
const app = express();
const Person = require("./models/persons");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.static("dist")); /* ESTO HACE LA CONEXIÓN */
var morgan = require("morgan");

morgan.token("content", function getContent(req) {
    return JSON.stringify(req.body);
});

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :content"
    )
);

// const requestLogger = (request, response, next) => {
//     console.log("Method:", request.method);
//     console.log("Path:  ", request.path);
//     console.log("Body:  ", request.body);
//     console.log("---");
//     next();
// };
// app.use(requestLogger);            --> REEMPLAZADO POR MORGAN

app.get("/", (req, res) => {
    res.send("<h1>OK</h1>");
});

app.get("/info", (req, res, next) => {
    Person.find({})
        .then((persons) => {
            res.send(`
                <p>
                    Phonebook has info for ${persons.length} people.
                <br>
                    ${date}
                </p>`);
        })
        .catch((error) => next(error));
});

app.get("/api/persons", (req, res) => {
    Person.find({}).then((persons) => {
        res.json(persons);
    });
});

app.get("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    Person.findById(id)
        .then((person) => {
            if (person) {
                res.json(person);
            } else {
                res.statusMessage = "La persona solicitada no existe";
                res.status(404).end();
            }
        })
        .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id)
        .then((result) => {
            res.json(result);
            res.status(204).end();
        })
        .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "person data missing",
        });
    }
    const person = new Person({
        name: body.name,
        number: body.number,
    });
    person.save().then((result) => {
        console.log(
            "added",
            result.name,
            "number",
            result.number,
            "to phonebook"
        );
    });
    res.json(person); // --> esta respuesta sirve para la renderización, NO BORRAR
});

app.put("/api/persons/:id", (req, res, next) => {
    const body = req.body;

    const person = {
        name: body.name,
        number: body.number,
    };

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then((updatedPerson) => {
            res.json(updatedPerson);
        })
        .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return res.status(400).send({ error: "malformatted id" });
    }

    next(error);
};
app.use(errorHandler); // este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
