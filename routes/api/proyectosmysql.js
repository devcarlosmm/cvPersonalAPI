const router = require("express").Router();
const connection = require("../../db");
const jwt = require("jwt-simple");

const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '/public/images')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

router.post('/projectlist/upload', upload.single('image'), (req, res) => {
    console.log(req.body)
    try {
        return res.status(201).json({
            message: 'File uploaded succesfully'
        });
    } catch (error) {
        console.error(error);
    }
});

//! DEVOLVER ID user
router.get('/projectlist/decode', (req, res) => {
    console.log('devuelvo el id')
    token = req.headers.accesstoken;
    payload = jwt.decode(token, process.env.SECRET_KEY);
    try {
        res.send(payload)
    } catch (error) {
        res.json(error)
    }
});

//! DEVOLVER TODOS LOS PROYECTOS
router.get('/projectlist', (req, res) => {
    token = req.headers.accesstoken;
    payload = jwt.decode(token, process.env.SECRET_KEY);
    console.log('Payload: ', payload)
    try {
        connection.query('SELECT * FROM project_collection WHERE id_user = 16', payload.id, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
    } catch (error) {
        res.json(error)
    }

});

//! DEVOLVER UN PROYECTO
router.get('/projectlist/project/:idProject', (req, res) => {

    console.log("id del puto proyecto", req.params)
    try {
        connection.query('SELECT * FROM project_collection WHERE project_id = ?', req.params.idProject, (err, result) => {
            if (err) throw err;
            console.log('Resultado', result);
            res.send(result);
        });
    } catch (error) {
        res.json(error);
    }
});

//! CREAR UN PROYECTO
router.post('/projectlist/create', (req, res) => {
    token = req.headers.accesstoken;
    payload = jwt.decode(token, process.env.SECRET_KEY);
    console.log('Payloadasd: ', payload)
    req.body.id_user = payload.id;
    console.log('Req.body: ', req.body)
    try {
        connection.query('INSERT INTO project_collection SET ?', req.body, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
    } catch (error) {
        res.json(error);
    }
});

//! ACTUALIZAR UN PROYECTO
router.post('/projectlist/update/:idProject', (req, res) => {
    try {
        connection.query('UPDATE project_collection SET ? WHERE project_id = ?', [req.body, req.params.idProject], (err, result) => {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
    } catch (error) {
        res.json(error);
    }
});

//! BORRAR UN PROYECTO
router.delete('/projectlist/delete/:idProject', (req, res) => {
    try {

        const idProject = req.params.idProject
        console.log('Entramos en borrar', idProject)
        connection.query('DELETE FROM project_collection WHERE project_id = ?', idProject, (err, result) => {
            if (err) throw err;
            res.send('Proyecto borrado');
        });
    } catch (error) {
        res.json(error);
    }
});

module.exports = router;