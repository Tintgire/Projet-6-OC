const Sauce = require("../models/sauce");
const fs = require("fs");

exports.createSauce = async (req, res) => {
  try {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });

    await sauce.save();

    res.status(201).json({ message: "Objet enregistré !" });
  } catch (error) {
    res.status(400).json({ error: `Invalid input data ${error.message}` });
  }
};

exports.getOneSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id });

    if (!sauce) {
      return res.status(404).json({ error: "Sauce not found" });
    }
    //on affiche la sauce renvoyée par MongoDB grâce à son Id
    res.status(200).json(sauce);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.modifySauce = (req, res) => {
  const sauceObject = req.file
    ? {
        //si oui, on le remplace dans l'objet sauce
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body }; //sinon, on modifie juste le corps de la requète sans fichier

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id });
        });
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //on cherche la sauce par son Id dans MongoDB
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        //mesure de sécurité pour empêcher un utilisateur autre que le créateur de la sauce de supprimer la sauce
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          //on supprime la sauce dans la base de données ET localement dans les fichiers
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces); //on affiche le tableau des sauces renvoyé par MongoDB
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
