const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.signup = async(req, res) => {
    try {
      const {email, password} = req.body //using destructuring object
      //hash du password par bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      //modèle de l'objet user
      const user = new User({
        email: email,
        password: hashedPassword,
      });
  
      await user.save();
  
      res.status(201).json({ message: "Utilisateur créé !" });
    } catch (error) {
      if (error.code === 11000) {
       // Erreur de clé en double MongoDB (email existe déjà)
        return res.status(400).json({ error: "L'email existe déjà" });
      }
      res.status(500).json({ error: "Internal server error" });
    }
};

exports.login = async(req, res) => {
  try {
    const {email, password} = req.body
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: "Paire login/mot de passe incorrecte" });
    }
     //vérification de la validité du hash
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Paire login/mot de passe incorrecte" });
    }
    //vérification de la clé du token et de sa validité
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_TOKEN, {
      expiresIn: process.env.EXPIRATION_TOKEN,
    });

    res.status(201).json({ userId: user._id, token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


