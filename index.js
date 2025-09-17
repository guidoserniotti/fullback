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

app.get("/info", (req, res) => {
    res.send(`
        <p>
            Phonebook has info for ${persons.length} people.
        <br>
            ${date}
        </p>`);
});

app.get("/api/persons", (req, res) => {
    Person.find({}).then((persons) => {
        res.json(persons);
    });
});

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    Person.findById(id).then((person) => {
        if (person) {
            res.json(person);
        } else {
            res.statusMessage = "La persona solicitada no existe";
            res.status(404).end();
        }
    });
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter((person) => person.id !== id);
    res.status(204).end();
});

app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "person data missing",
        });
    }
    if (persons.some((person) => person.name === body.name)) {
        return res.status(400).json({
            error: "this name already exists",
        });
    }
    const person = {
        id: Math.floor(Math.random() * 1000),
        name: body.name,
        number: body.number,
    };
    persons = persons.concat(person);
    res.json(person);
    console.log("resultado post", req.body);
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
