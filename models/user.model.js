const mongoose = require('mongoose');
const bcrypt = require("../utils/bcrypt");
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');


// User Schema
const userSchema = new Schema({
  id: {
    type: String,
    default: uuidv4, 
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isVerified : {
    type : Boolean,
    default : false
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['User', 'Admin'],
    default: 'User' 
  }
}, { timestamps: true });

userSchema.methods.comparePassword = async function ( password ) {
     const isMatch = bcrypt.comparePassword(password , this.password);
     return isMatch;
}
 
 
const User = mongoose.model('User', userSchema);

module.exports = User;