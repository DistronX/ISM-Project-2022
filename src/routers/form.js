import express from 'express';


// Internal Imports
import { Form } from '../models/form.js';
import { upload } from '../lib/upload.js';
import { encryptImage } from '../lib/image_utils.js';


const router = new express.Router();


router.post('/create', upload.single('file'), async (req, res) => {
  try{
    const {file, body} = req;
    const filePath = file.path;
    const {encrypted_image, mask, shape} = await encryptImage(filePath);
    const form = new Form({
      documentMeta: {
        path: encrypted_image,
        mask: mask,
        shape: shape,
      },
      message: body.message,
    });
    await form.save();
    // TODO: Here redirection should be to the post login page of the user.
    res.redirect('/');
  }catch(err) {
    console.log(err.message);
    res.status(500).send(err);
  }
});


export {router};