const Comment = require("../models/Comment");
const Article = require("../models/Article");

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const articleId = req.params.articleId;

    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: "Article non trouvé" });

    const comment = await Comment.create({
      content,
      article: articleId,
      author: req.user._id,

    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.getCommentsByArticle = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const comments = await Comment.find({ article: articleId })
      .populate("author", "username photo")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Commentaire introuvable" });

    if (comment.author.toString() !== req.userId)
      return res.status(403).json({ message: "Non autorisé à supprimer ce commentaire" });

    await comment.deleteOne();
    res.status(200).json({ message: "Commentaire supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
