const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10) //hash du password par bcrypt
    .then((hash) => {
      const user = new User({
        //modèle de l'objet user
        email: req.body.email,
        password: hash,
      });
      user
        .save() //sauvegarde du l'user dans MongoDB
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      bcrypt //vérification de la validité du hash
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              message: "Paire login/mot de passe incorrecte",
            });
          }
          res.status(201).json({
            userId: user._id, //vérification de la clé du token et de sa validité
            token: jwt.sign(
              { userId: user._id },
              "${process.env.SECRET_TOKEN}",
              {
                expiresIn: `${process.env.EXPIRATION_TOKEN}`,
              }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
