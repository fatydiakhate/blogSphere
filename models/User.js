const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    
  },
  email: {
    type: String,
    required: true,
    unique: true, // Example of a schema option
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['adim', 'author', 'reader'],
    default: 'reader',
  },
  createdAt: {
    type: Date,
    default: Date.now // Example of a default value
  }
},
  {timestamps: true}
);
userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();
  
  try{
    const salt= await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }catch (err) {
    next(err);
  }
});

// Creating a Mongoose Model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;