const router = require("express").Router();
const apiRouterProyectos = require("./api/proyectos");
const apiRouterProyectosMysql = require("./api/proyectosmysql");
const moment = require("moment");
const jwt = require("jwt-simple");
const middlewares = require("./middlewares");
const connection = require("../db");

// Añadimos bcrypt para encriptar la contraseña
const bcrypt = require("bcrypt");
const saltRounds = 10;
router.use("/proyectosmysql", middlewares.checkToken, apiRouterProyectosMysql);
router.use("/proyectos", middlewares.checkToken, apiRouterProyectos);


router.post("/checkUser", (req, res) => {
    const userName = req.body.user;
    const userPass = req.body.password;
    /*     const hash = bcrypt.hashSync(userPass, saltRounds); */
    let usuario = '';
    //Comprobamos si el usuario y contraseña existe en la base de datos
    connection.query("SELECT * FROM user_collection WHERE user_name = ?", userName, function(err, result) {
        if (err) {
            console.log('Error de login: ', err);
        } else {
            if (result.length > 0) {
                usuario = result[0];
                console.log('Resultado-password: ', usuario.user_password)
                const iguales = bcrypt.compareSync(userPass, usuario.user_password)
                if (iguales) {
                    console.log('Coinciden');
                    const token = generateToken(usuario);
                    console.log('Token: ', token);
                    res.json(token);

                } else {
                    const error = "Usuario o contraseña incorrectos";
                    console.log("Error", error);
                    res.render('index', { err: error });
                }

            } else {
                const error = "Usuario o contraseña incorrectos";
                console.log("Error", error);
                res.render('index', { err: error });
            }

        }

    });

});



function generateToken(pUsuario) {
    let payload = {
        id: pUsuario.id_user,
        usuario: pUsuario.user_name,
        createdAt: moment().unix(),
        expiredAt: moment().add(90, "minutes").unix(),
    };
    const token = jwt.encode(payload, process.env.SECRET_KEY);
    /* console.log(token); */
    return token;
    /*     res.json(token); */
}


module.exports = router;