const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
 },
  content: { 
    type: String,
    required: true, 
}, // contenu enrichi (HTML/Markdown selon l’éditeur)
//   image: { 
//     type: String 
// },
coverImage: {
      type: String,
    },
 // image principale de l'article (optionnelle)
  isDraft: { 
    type: Boolean, 
    default: true 
},
status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
},
  author: { type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true 
},
likes: [{ type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
}],
views: {
  type: Number,
  default: 0
},

dislikes: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],

category: {
  type: String,
  required: true,
  enum: ["Technologie", "Santé", "Education", "Business", "Lifestyle"], // à adapter selon ton projet
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
