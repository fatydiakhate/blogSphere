// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const auth = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ error: "Token manquant ou invalide" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.userId).select("-password");
//     if (!user) {
//       return res.status(404).json({ error: "Utilisateur introuvable" });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     res.status(401).json({ error: "Accès non autorisé" });
//   }
// };

// module.exports = auth;
