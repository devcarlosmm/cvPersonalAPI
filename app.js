const express = require("express");
const exphbs = require("express-handlebars");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
// Libreria para las variables de entorno
require("dotenv").config();

// Base de datos
require("./db");

//Rutas
const apiRouter = require("./routes/api");
const proyectosRouter = require("./routes/proyectos");
const mysqlRouter = require('./routes/proyectosmysql');
const indexRouter = require('./index');

// Motor de plantillas
app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(cors());
/* app.use(express.json());
app.use(express.urlencoded({ extended: true })); */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static("public"));

app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/proyectos", proyectosRouter);
app.use("/mysql", mysqlRouter);
/* app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 })) */
//O me pillas PORT o el 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}!`);
});