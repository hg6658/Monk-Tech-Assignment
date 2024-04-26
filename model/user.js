const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  emailID: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

userSchema.pre('save', async function(next) {
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.saltRounds));

    const hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});


const User = mongoose.model('User', userSchema);

module.exports = User;
