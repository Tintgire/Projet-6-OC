const express = require("express");
const mongoose = require("mongoose");

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
const path = require("path");
const helmet = require("helmet");

const dotenv = require("dotenv");

dotenv.config({ path: "./vars/.env" });

//mise en place d'un limiteur de connexion pour éviter les attaques
const rateLimit = require("express-rate-limit");

//définition des caractéristiques du limiteur de connexion
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // fenêtre de 15 minutes
  max: 5, // Limite chaque IP à 5 connexions max par fenêtre de 15 minutes
  standardHeaders: true, // Retourne la limitation dans le header `RateLimit-*`
  legacyHeaders: false, // désactive les headers `X-RateLimit-*`
});

mongoose
  .connect(
    `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASSWORD}@cluster0.69owevz.mongodb.net/${process.env.DATA_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

//mise en place de headers spécifiques afin d'éviter les erreurs CORS

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json()); //afin d'extraire le corps JSON des requêtes POST //

//définition des différents paths et sécurités pour l'utilisation des routes

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes, limiter);
app.use("/images", express.static(path.join(__dirname, "images")));
module.exports = app;
