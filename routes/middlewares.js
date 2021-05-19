const jwt = require("jwt-simple");
const moment = require("moment");
const router = require("Express").Router();
const connection = require("../db");

exports.checkToken = (req, res, next) => {
    //Si no tengo en la cabecera algo que se llame "accessToken"
    if (!req.headers["accesstoken"]) {
        return res
            .status(403)
            .json({ error: "Debes incluir la cabecera accesstoken" });
    }

    //Si existe la cabecera, la vamos a sacar a una variable para poder trabajar con ella
    const token = req.headers["accesstoken"];
    let payload = null;
    try {
        payload = jwt.decode(token, process.env.SECRET_KEY);
        console.log('Payload: ', payload)
    } catch (error) {
        res.status(403).json({ error: "El token incluido es incorrecto" });
    }
    if (moment().unix() > payload.expiredAt) {
        return res.status(403).json({ error: "El token ha expirado" });
    }
    //! Modificar con conexion a base de datos y comprobar el usuario.
    console.log('Payload: ', payload)
    let usuario
    checkUsuario(payload).then(data => {
            usuario = data
        }).catch(error => { 'Error' })
        /* console.log("usuario midelware: ", usuario) */
    if (payload.usuario !== "c.m.m.admin") {
        return res.status(403).json({ error: "El usuario es incorrecto" });
    }
    //Esta variable la puedo utilizar donde quiera
    req.payload = payload;

    next();
};

function checkUsuario(pPayload) {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM user_collection WHERE user_name = ?", pPayload.usuario, (err, result) => {
            if (err) throw err;
            var resultado = JSON.stringify(result);
            /* console.log('usuario nombre: ', resultado) */
            resolve(resultado);
        })
    })
}