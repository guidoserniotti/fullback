const date = new Date();
const express = require("express");
const app = express();
app.use(express.json());
var morgan = require("morgan");

morgan.token("content", function getContent(req) {
    return JSON.stringify(req.body);
});

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :content"
    )
);

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

// const requestLogger = (request, response, next) => {
//     console.log("Method:", request.method);
//     console.log("Path:  ", request.path);
//     console.log("Body:  ", request.body);
//     console.log("---");
//     next();
// };
// app.use(requestLogger);

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
    res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find((person) => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.statusMessage = "La persona solicitada no existe";
        res.status(404).end();
    }
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    // console.log(persons.find((person) => person.id === id));
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
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
