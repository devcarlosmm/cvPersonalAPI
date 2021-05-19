const router = require("express").Router();
const connection = require("./db");

router.get("/", (req, res) => {
    res.render('index');
});

module.exports = router;