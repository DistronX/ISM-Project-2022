import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import validator from "validator";


const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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
  },
  specialization: {
    type: String,
  },
}, {
  timestamps: true,
});


//static function to find an admin using email and password
DoctorSchema.statics.findByCredentials = async (email, password) => {
  const doctor = await Doctor.findOne({
    email: email,
  });
  if (!doctor) {
    throw new Error("User not found");
  }
  const passwordMatched = await bcrypt.compare(password, doctor.password);
  if (!passwordMatched) {
    return "Password Incorrect";
  }
  return doctor;
};

// This validator is trimming all the fields and is removing special characters from string entries.
// Used function because pre method doesn't support arrow functions as call back.
// pre is basically a before save call
DoctorSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    const hash = await bcrypt.hash(this.password, 8);
    this.password = hash;
  }
  next();
});

const Doctor = mongoose.model('Doctor', DoctorSchema);

export {Doctor};