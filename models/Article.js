const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
 },
  content: { 
    type: String 
}, // contenu enrichi (HTML/Markdown selon l’éditeur)
  image: { 
    type: String 
}, // image principale de l'article (optionnelle)
  isDraft: { 
    type: Boolean, 
    default: true 
},
  author: { type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true 
},
  likes: [{ type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
}],
  views: { type: Number, 
    default: 0 
},
  createdAt: { type: Date, 
    default: Date.now 
},
  updatedAt: { type: Date, 
    default: Date.now 
}
}, 
{ timestamps: true });

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
