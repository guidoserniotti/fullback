const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

const password = process.argv[2];

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

console.log("connecting to", url);

mongoose
    .connect(url)
    .then((result) => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connecting to MongoDB:", error.message);
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    });
    person.save().then((result) => {
        console.log(
            "added",
            result.name,
            "number",
            result.number,
            "to phonebook"
        );
        mongoose.connection.close();
    });
} else if (process.argv.length === 3) {
    Person.find({}).then((result) => {
        result.forEach((person) => {
            console.log(person);
        });
        mongoose.connection.close();
    });
} else {
    console.log("pone bien los argumentos");
    mongoose.connection.close();
}
