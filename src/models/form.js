import mongoose from "mongoose";


const FormSchema = new mongoose.Schema({
  documentMeta: {
    type: {
      enc_path: {
        type: String,
        required: true,
      },
      enc_rel_path: {
        type: String,
        required: true,
      },
      dec_path: {
        type: String,
        required: true,
      },
      dec_rel_path: {
        type: String,
        required: true,
      },
      mask: {
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
  doctor: {
    type: String,
    required: true
  },
}, {
  timestamps: true,
});

const Form = mongoose.model('Form', FormSchema);

export {Form};