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
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  viewAccess: {
    type: String,
  },
}, {
  timestamps: true,
});

const Form = mongoose.model('Form', FormSchema);

export {Form};