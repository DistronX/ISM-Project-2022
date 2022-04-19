import mongoose from "mongoose";


const FormSchema = new mongoose.Schema({
  documentMeta: {
    type: {
      path: {
        type: String,
        required: true,
      },
      mark: {
        type: [[Number]],
        required: true,
      },
      shape: {
        type: [Number],
        required: true,
      }
    },
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  viewAccessList: {
    type: [String],
    default: []
  }
});

const Form = mongoose.model('Form', FormSchema);

export {Form};