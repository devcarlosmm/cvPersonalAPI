const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const Proyecto = require("../../models/proyecto");

router.get("/", async(req, res) => {
    console.log(req.payload);
    try {
        const proyectos = await Proyecto.find({}).lean();
        const arrMap = proyectos.map((proyecto) => {
            let imagen = proyecto.imagen ?
                proyecto.imagen.substring(proyecto.imagen.indexOf("/") + 1) :
                "";
            return {
                ...proyecto,
                imagen: imagen,
            };
        });
        res.json(arrMap);
    } catch (err) {
        res.status(503).json({ error: err });
    }
});
router.get("/:idProyecto", async(req, res) => {
    try {
        const proyecto = await Proyecto.findById(req.params.idProyecto);
        res.json(proyecto);
    } catch (error) {
        res
            .status(503)
            .json({ error: "Error al intentar encontrar proyecto por id" });
    }
});

router.get("/categoria/:categoria", async(req, res) => {
    try {
        const proyectos = await Proyecto.find({ categoria: req.params.categoria });
        res.json(proyectos);
    } catch (err) {
        res.status(503).json({ error: "Error al intentar encontrar categoria" });
    }
});

router.post("/", [
        check(
            "titulo",
            " El titulo debe incluirse en la peticion y debe incluir un maximo de 10 caracteres"
        )
        .exists()
        .notEmpty()
        .isLength({ min: 3, max: 10 }),
        check(
            "descripcion",
            " La descripcion debe incluirse en la peticion"
        )
        .exists()
        .notEmpty()
        .isLength({ max: 300 }),
        check(
            "url",
            "La url del proyecto debe estar correcta"
        )
        .isURL()
    ],
    async(req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            const proyect = await Proyecto.create(req.body);
            res.json(proyect);
        } catch (err) {
            res.status(503).json({ error: err });
        }
    }
);

router.delete("/:proyectoId", async(req, res) => {
    try {
        const proyectoBorrado = await Proyecto.findByIdAndDelete(
            req.params.proyectoId
        );
        res.json(proyectoBorrado);
    } catch (err) {
        res.status(503).json({ error: err });
    }
});

router.put("/:proyectoId", async(req, res) => {
    try {
        const proyectoEditado = await Proyecto.findByIdAndUpdate(
            req.params.proyectoId,
            req.body, { new: true }
        );
        res.json(proyectoEditado);
    } catch (err) {
        res.status(503).json({ error: err });
    }
});

module.exports = router;