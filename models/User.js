const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

/*const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});*/

const validateEmail = (email) => {
  const regexMail =
    /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;
  return regexMail.test(email);
};

const validatePassword = (password) => {
  const regexPassword =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  return regexPassword.test(password);
};

const userSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Veuillez renseigner une adresse mail valide"],
    match: [
      /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/,
      "Veuillez renseigner une adresse mail valide",
    ],
  },
  password: {
    type: String,
    validate: [
      validatePassword,
      "Au moins une majuscule, une minuscule, un chiffre, un caractère spécial et doit avoir une taille minimal de 8 caractères",
    ],
    match: [
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Au moins une majuscule, une minuscule, un chiffre, un caractère spécial et doit avoir une taille minimal de 8 caractères",
    ],
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
