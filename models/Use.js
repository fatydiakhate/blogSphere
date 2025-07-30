const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true // Example of a schema option
  },
  email: {
    type: String,
    required: true,
    unique: true, // Example of a schema option
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now // Example of a default value
  }
});

// Creating a Mongoose Model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;