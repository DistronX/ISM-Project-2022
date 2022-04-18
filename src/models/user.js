import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import validator from "validator";


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    }
  },
  phoneNumber: {
    type: String,
    unique: true,
  }
});

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({
    email: email,
  });
  if (!user) {
    throw new Error("User not found");
  }
  const passwordMatched = await bcrypt.compare(password, user.password);
  if (!passwordMatched) {
    return "Password Incorrect";
  }
  return user;
};


UserSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    const hash = await bcrypt.hash(this.password, 8);
    this.password = hash;
  }
  next();
});


const User = mongoose.model('User', UserSchema);

export {User};