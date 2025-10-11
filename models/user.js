// en un modelo primero se importa mongoose
const mongoose = require("mongoose");

// se crea el esquema (plantilla) para moldear el modelo para la base de datos
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: [
            3,
            "La longitud del nombre de usuario debe ser de 3 caracteres como mínimo.",
        ],
        unique: [true, "Este nombre de usuario ya está siendo utilizado."],
    },
    passwordHash: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
        },
    ],
});
// se parsea el esquema para que no guarde ciertos atributos en la BD
userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

// se crea y exporta el modelo parseado y filtrado en base a lo que se le PIDE al esquema y por lo tanto a la BD
module.exports = mongoose.model("User", userSchema);
