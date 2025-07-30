const User = require("../models/User");

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
exports.Login = async (req, res) => {
    // const {email, password} = req.body

    // const existingEmail = await Email.findOne({user });
    //     if(existingEmail){
    //         return res.status(409).json({error: "Email déja utilisé "});
    //     }
};
//Profile
//Deconnexion