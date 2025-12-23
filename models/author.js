const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const authorSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Invalid Email address",
    },

    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  refreshToken: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['member', 'admin'],
    default: 'member',
  },
});


authorSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
  });

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
