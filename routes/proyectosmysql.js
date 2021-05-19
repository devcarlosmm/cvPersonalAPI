const router = require("express").Router();
const connection = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Agregar usuario
/* router.post('/addUser', (req, res) => {
    try {
        const user_name = req.body.user_name;
        const hash = bcrypt.hashSync(req.body.user_password, saltRounds);
        req.body.user_password = hash;

        connection.query('SELECT * FROM user_collection WHERE user_name = ?', user_name, (err, result) => {
            if (err) throw err;

            if (result[0]) {
                console.log('Ya existe', result[0]);
                res.status(401).send(`Error, ya existe este usuario en la base de datos: ${result[0].user_name}`);
            } else {
                result = true;
                res.status(500).send(`Usuario no encontrado: ${result}`);

                connection.query('INSERT INTO user_collection SET user_name = ?, user_password = ?', [req.body.user_name, req.body.user_password], (err, result) => {
                    if (err) throw err;
                    res.status(201).send(`Usuario añadido con ID: $ { result.insertId }`);
                });
            }
        });
    } catch (error) {
        res.json(error);
    }
}); */
// FIN agregar usuario


// ALT
router.post('/addUser', (req, res) => {
    try {
        console.log('Estoy en addUser ', req.body)
        const hash = bcrypt.hashSync(req.body.user_password, saltRounds);
        req.body.user_password = hash;

        connection.query('INSERT INTO user_collection SET user_name = ?, user_password = ?', [req.body.user_name, req.body.user_password], (err, result) => {
            if (err) throw err;
            res.send(`Usuario añadido con ID: ${ result.insertId }`);
        });
    } catch (error) {
        res.json(error);
    }
});
// FIN ALT


//
router.post('/check', (req, res) => {
    try {
        let name = req.body.user_name;
        console.log("Req.body check", req.body)
        connection.query('SELECT * FROM user_collection WHERE user_name = ?', name, (err, result) => {
            if (err) throw err;

            if (result[0]) {
                console.log('Ya existe', result[0]);
                result = false;
                console.log('Result de que existe', result);
                res.send(result);
            } else {
                result = true;
                console.log('Result de que no existe', result);
                /* res.status(500).send(`Usuario no encontrado: ${result}`); */
                res.send(result);
            }
        });
    } catch (error) {
        res.json(error);
    }
});
//
router.get('/proyectos/index', (req, res) => {
    try {
        connection.query('SELECT * FROM project_collection WHERE id_user = 16', (err, result) => {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
    } catch (error) {
        res.json(error)
    }

});

router.get('/categoria/:categoria', (req, res) => {
    try {
        connection.query('SELECT * FROM project_collection WHERE project_category = ?', req.params.categoria, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
    } catch (error) {
        res.json(error)
    }

});

router.get('/proyecto/:idproyecto', (req, res) => {
    try {
        connection.query('SELECT * FROM project_collection WHERE project_id = ?', req.params.idproyecto, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
    } catch (error) {
        res.json(error)
    }

});

router.post('/', (req, res) => {
    try {
        connection.query('INSERT INTO project_collection SET ?', req.body, (err, result) => {
            if (err) throw err;
            res.status(201).send(`
                                        Proyecto añadido con ID: $ { result.insertId }
                                        `);
        })
    } catch (error) {
        res.json(error);
    }
});


router.put('/:idProject', (req, res) => {
    try {
        connection.query('UPDATE project_collection SET ? WHERE project_id = ?', [req.body, req.params.idProject], (err, result) => {
            if (err) throw err;
            res.send('Proyecto actualizado');
        });
    } catch (error) {
        res.json(error);
    }
});

router.delete('/:idProject', (req, res) => {
    try {
        const idProject = req.params.idProject
        connection.query('DELETE FROM project_collection WHERE project_id = ?', idProject, (err, result) => {
            if (err) throw err;
            res.send('Proyecto borrado');
        });
    } catch (error) {
        res.json(error);
    }

});
module.exports = router;