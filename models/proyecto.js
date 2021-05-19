const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let proyectoSchema = Schema({
    titulo: String,
    descripcion: String,
    url: String,
    cliente: String,
    urlCliente: String,
    categoria: {
        type: String,
        enum: ["angular", "wordpress", "nodejs", "frontend", "backend"],
    },
    imagen: String,
});

module.exports = mongoose.model("Proyecto", proyectoSchema);