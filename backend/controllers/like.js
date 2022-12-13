const Sauce = require("../models/sauce");

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      let message = "";

      if (req.body.like === 1) {
        sauce.usersLiked.push(req.body.userId);
        message = "The sauce was liked";
      }
      if (req.body.like === -1) {
        sauce.usersDisliked.push(req.body.userId);
      }
      if (req.body.like === 0) {
        if (sauce.usersLiked.includes(req.body.userId)) {
          const usersLikedIndex = sauce.usersLiked.indexOf(req.body.userId);
          sauce.usersLiked.splice(usersLikedIndex, 1);
        }
        if (sauce.usersDisliked.includes(req.body.userId)) {
          const usersDislikedIndex = sauce.usersDisliked.indexOf(
            req.body.userId
          );
          sauce.usersDisliked.splice(usersDislikedIndex, 1);
        }
      }
      sauce.likes = sauce.usersLiked.length;
      sauce.dislikes = sauce.usersDisliked.length;

      sauce
        .save()
        .then(() => res.status(201).json({ message: `${message}` }))
        .catch((error) => res.status(404).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
