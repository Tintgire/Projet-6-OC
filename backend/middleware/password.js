const passwordSchema = require("../models/validator");

//création du middleware de contôle de la complexité du password

module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    //on peut encore lire le mot de passe non hashé
    res.writeHead(400, "invalidPASS", {
      "content-type": "application/json",
    });
    res.end("invalidPASS");
  } else {
    next();
  }
};
