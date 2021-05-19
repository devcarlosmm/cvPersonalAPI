const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "public/images" });
const fs = require("fs");

const Proyecto = require("../models/proyecto");
router.get("/", async(req, res) => {
    try {
        const proyectos = await Proyecto.find().lean();
        console.log(proyectos);
        res.render("proyectos/index", { proys: proyectos });
    } catch (error) {
        res.json(error);
    }
});

router.get("/new", async(rec, res) => {
    res.render("proyectos/formulario");
});

router.get("/details/:proyectoId", async(req, res) => {
    const proyecto = await Proyecto.findById(req.params.proyectoId).lean();
    const separado = proyecto.imagen.split('\\');
    console.log('Separado: ',
        separado);
    proyecto.imagen = '/' + separado[1] + '/' + separado[2];
    console.log(proyecto.imagen);

    res.render("proyectos/detalles", { proy: proyecto });
});

router.get("/edit/:proyectoId", async(req, res) => {
    const proyecto = await Proyecto.findById(req.params.proyectoId).lean();
    console.log(proyecto);
    res.render("proyectos/formEdit", { proy: proyecto });
});

router.post("/create", upload.single("imagen"), async(req, res) => {
    // TODO GEstionar la imagen
    console.log(req.file);
    const finalPath = req.file.path + "." + mimeTypeExtension(req.file.mimetype);
    fs.renameSync(req.file.path, finalPath);
    req.body.imagen = finalPath;

    try {
        const proyecto = await Proyecto.create(req.body);
        res.redirect("/proyectos");
    } catch (error) {
        res.status(503).json({ error: " error al crear" });
    }
});

router.post("/update", upload.single("imagen"), async(req, res) => {
    const finalPath = req.file.path + "." + mimeTypeExtension(req.file.mimetype);
    fs.renameSync(req.file.path, finalPath);
    req.body.imagen = finalPath;
    try {
        const proyectoUpdated = await Proyecto.findByIdAndUpdate(
            req.body.proyectoId,
            req.body
        );
        res.redirect("/proyectos");
    } catch (error) {
        res.json({ error: "Fallo al updatear" });
    }
});

function mimeTypeExtension(pMimeType) {
    return pMimeType.split("/")[1];
}
module.exports = router;