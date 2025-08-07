const express = require("express");
const cors = require("cors");
require('dotenv').config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/AuthRoutes");
const articleRoutes = require("./routes/ArticleRoutes");
const commentRoutes = require("./routes/CommentRoutes");
const multer = require('multer');
const path = require('path');

// const categoryRoutes = require("./routes/CategoryRoutes");

const app = express();

// Connect DB
connectDB();

//Middlewares et cors
app.use(cors());
app.use(express.json());

//Importation des routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);
// app.use("/api/categories", categoryRoutes);
app.use("/uploads", express.static("uploads"));

//Routes
app.get("/",(req,res)=>{
    res.send("Bienvenue sur mon backend !");
});

//Serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

//profil
app.get('/api/profile', async (req, res) => {
  try {
      const userId = req.headers['user-id']
  } catch (err) {}
  });
// Configuration de Multer pour l'upload des fichiers
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // le dossier d'upload
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // ajout d'un timestamp pour éviter les conflits
//   }
// });
// const upload = multer({ storage: storage });