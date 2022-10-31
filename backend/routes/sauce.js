const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const sauceCtrl = require("../controllers/sauce");
const likeController = require("../controllers/like");

router.post("/", auth, multer, sauceCtrl.createThing);
router.get("/", auth, sauceCtrl.getAllStuff);
router.get("/:id", auth, sauceCtrl.getOneThing);
router.put("/:id", auth, multer, sauceCtrl.modifyThing);
router.delete("/:id", auth, sauceCtrl.deleteThing);
router.post("/:id/like", auth, likeController.likeSauce);

module.exports = router;
