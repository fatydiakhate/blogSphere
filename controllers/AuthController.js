const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Registre
exports.registre = async (req, res) =>{
    try{
        const {name, email, password} = req.body

        const existingUser = await User.findOne({email });
        if(existingUser){
            return res.status(409).json({error: "Email déja utilisé "});
        }
        //creation de l'utilisateur avec les champs exacts
        const user = new User(
            {
             name,
             email,
             password,   
            }
        );
        await user.save();
        res.status(201).json({message: "Utilisateur créé avec succés"});
    }catch (err){
        res.status(400).json({error: err.message });
    }
};
//Login
exports.login = async (req, res) => {
    try{
        const {email, password} = req.body

        const user = await User.findOne({email });
        if(!user){
            return res.status(404).json({error: "Utilisateur non trouvé "});
        }
        //Vérification du mot de pass
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
        }
        //GÉNÉRATION DU TOKEN JWT ICI
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({message: "Connexion réussie", token, name: user.name, email: user.email});
    }catch (err){
        res.status(400).json({error: err.message });
    }
};
//Profile


// Profil de l'utilisateur
exports.profile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Token manquant ou invalide" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Assure-toi que JWT_SECRET est défini

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(401).json({ error: "Accès non autorisé" });
    }
};
// Mise à jour du profile
exports.updateProfile = async (req, res) => {
  try {
    // Authentification via token dans l'en-tête
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token manquant ou invalide" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Mise à jour des champs (si fournis dans req.body)
    const { name, email, password,profileImage,bio } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // sera re-hashé grâce au hook pre('save')
    if (profileImage) user.profileImage = profileImage;
    if (bio) user.bio = bio;

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");
    res.status(200).json({ user: updatedUser });;
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


//Deconnexion
// Déconnexion (optionnelle côté serveur)
exports.logout = (req, res) => {
  res.status(200).json({ message: "Déconnexion réussie" });
};

// Delete Compte