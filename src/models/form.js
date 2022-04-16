import mongoose from "mongoose";


const FormSchema = new mongoose.Schema({
  documentMeta: {
    type: String,
    required: true,
  },
  viewAccessList: {
    type: [String]
  }
});

const Form = mongoose.model('Form', FormSchema);

export {Form};