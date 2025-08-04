const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const commentController = require("../controllers/CommentController");

// Créer un commentaire sur un article
router.post("/:articleId", auth, commentController.createComment);

// Récupérer les commentaires d’un article
router.get("/:articleId", commentController.getCommentsByArticle);

// Supprimer un commentaire
router.delete("/delete/:commentId", auth, commentController.deleteComment);

module.exports = router;
