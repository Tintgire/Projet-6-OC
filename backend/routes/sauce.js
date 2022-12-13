const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const sauceCtrl = require("../controllers/sauce");
const likeController = require("../controllers/like");

//mise en place des routeurs pour chaque type de route avec ajout du middleware d'authentification

router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, likeController.likeSauce);

//export du routeur

module.exports = router;
