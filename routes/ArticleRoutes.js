const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const articleController = require("../controllers/ArticleController");

// Créer un article (brouillon ou publié)
router.post("/ajouter", auth, articleController.createArticle);

// Recupere tous les articles
router.get("/allArticles", auth, articleController.getAllArticles);

// Modifier un article
router.put("/:id", auth, articleController.updateArticle);

// Supprimer un article
router.delete("/:id", auth, articleController.deleteArticle);

// Derniers articles publiés
router.get("/", articleController.getLatestArticles);

// Rechercher ou filtrer
router.get("/search", articleController.getArticlesByFilters);

// Voir les articles publics d’un auteur
router.get("/author/:authorId", articleController.getArticlesByAuthor);

// Voir les articles de l’utilisateur connecté
router.get("/me/dashboard", auth, articleController.getUserDashboardArticles);

// Liker / unliker un article
router.post("/:id/like", auth, articleController.toggleLikeArticle);

// Dislike un article
router.post("/:id/dislike", auth, articleController.addDislike);
router.delete("/:id/dislike", auth, articleController.removeDislike);

// Lire un article (et incrémenter les vues) — À placer tout à la fin
router.get("/:id", articleController.getArticleById);

module.exports = router;
