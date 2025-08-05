const Article = require("../models/Article");
const User = require("../models/User");
const Comment = require("../models/Comment");

// Créer un article
exports.createArticle = async (req, res) => {
  try {
    const authorId = req.user._id.toString();
    const { title, content, image, isDraft, category } = req.body;

    const article = new Article({
      title,
      content,
      coverImage: image,
      isDraft: isDraft ?? true,
      category,
      author: authorId,
    });

    await article.save();

    res.status(201).json({ message: "Article créé avec succès 📝", article });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Récupérer tous les articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer un article par ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("author", "username")
      .exec();
      article.views += 1;
      await article.save();


    if (!article) {
      return res.status(404).json({ error: "Article introuvable" });
    }
    const comments = await Comment.find({ article: article._id })
      .populate("author", "username photo")
      .sort({ createdAt: -1 });

    res.json({
      ...article.toObject(),
      likesCount: article.likes.length,
      dislikesCount: article.dislikes.length,
      comments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour un article
exports.updateArticle = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { title, content, image, isDraft, category } = req.body;

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: "Article introuvable" });
    }

    if (article.author.toString() !== userId) {
      return res.status(403).json({ error: "Accès non autorisé" });
    }

    article.title = title ?? article.title;
    article.content = content ?? article.content;
    article.coverImage = image ?? article.coverImage;
    article.isDraft = isDraft ?? article.isDraft;
    article.category = category ?? article.category;

    await article.save();

    res.json({ message: "Article mis à jour avec succès", article });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer un article
exports.deleteArticle = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: "Article introuvable" });
    }

    if (article.author.toString() !== userId) {
      return res.status(403).json({ error: "Accès non autorisé" });
    }

    await article.deleteOne();
    res.json({ message: "Article supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Liker un article
exports.likeArticle = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: "Article introuvable" });
    }

    if (article.likes.includes(userId)) {
      return res.status(400).json({ error: "Vous avez déjà liké cet article" });
    }

    article.likes.push(userId);
    article.dislikes = article.dislikes.filter((id) => id.toString() !== userId);

    await article.save();

    res.json({ message: "Article liké avec succès ❤️", likes: article.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Disliker un article
exports.dislikeArticle = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: "Article introuvable" });
    }

    if (article.dislikes.includes(userId)) {
      return res.status(400).json({ error: "Vous avez déjà disliké cet article" });
    }

    article.dislikes.push(userId);
    article.likes = article.likes.filter((id) => id.toString() !== userId);

    await article.save();

    res.json({ message: "Article disliké avec succès👎", dislikes: article.dislikes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ... les autres fonctions que tu as déjà

// Derniers articles publiés
exports.getLatestArticles = async (req, res) => {
  try {
    const articles = await Article.find({ isDraft: false })
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Rechercher / filtrer les articles
exports.getArticlesByFilters = async (req, res) => {
  try {
    const { keyword, category } = req.query;
    const filters = { isDraft: false };

    if (keyword) {
      filters.title = { $regex: keyword, $options: "i" };
    }
    if (category) {
      filters.category = category;
    }

    const articles = await Article.find(filters)
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Voir les articles publics d’un auteur
exports.getArticlesByAuthor = async (req, res) => {
  try {
    const authorId = req.params.authorId;

    const articles = await Article.find({ author: authorId, isDraft: false })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Voir les articles de l’utilisateur connecté
exports.getUserDashboardArticles = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const articles = await Article.find({ author: userId })
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Liker / unliker un article
exports.toggleLikeArticle = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: "Article introuvable" });
    }

    if (article.likes.includes(userId)) {
      article.likes = article.likes.filter((id) => id.toString() !== userId);
    } else {
      article.likes.push(userId);
      article.dislikes = article.dislikes.filter((id) => id.toString() !== userId);
    }

    await article.save();

    res.json({
      message: "Action effectuée",
      likesCount: article.likes.length,
      dislikesCount: article.dislikes.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ajouter un dislike
exports.addDislike = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: "Article introuvable" });
    }

    if (!article.dislikes.includes(userId)) {
      article.dislikes.push(userId);
      article.likes = article.likes.filter((id) => id.toString() !== userId);
    }

    await article.save();

    res.json({
      message: "Dislike ajouté",
      dislikesCount: article.dislikes.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer un dislike
exports.removeDislike = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: "Article introuvable" });
    }

    article.dislikes = article.dislikes.filter((id) => id.toString() !== userId);
    await article.save();

    res.json({
      message: "Dislike supprimé",
      dislikesCount: article.dislikes.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


