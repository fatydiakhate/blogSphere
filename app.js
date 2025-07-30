const express = require("express");
const cors = require("cors");
require('dotenv').config();
const connectDB = require("./config/db");

const app = express();

// Connect DB
connectDB();

//Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.get("/",(req,res)=>{
    res.send("Bienvenue sur mon backend !");
});

//Serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});