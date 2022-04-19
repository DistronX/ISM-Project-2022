import express from 'express';

const router = new express.Router();


// Internal Imports
import { User } from '../models/user.js';
import { Form } from '../models/form.js';
import { upload } from '../lib/upload.js';
import { encryptImage } from '../lib/image_utils.js';

let SESSION_USER_ID = undefined;

router.get('/signup', async (req, res) => {
  try{
    res.render("user_signup");
  }catch(err){
    res.send(err.message);
  }
});


router.post('/signup', async (req, res) => {
  try{
    const user = new User(req.body);
    await user.save();
    res.send(user);
  }catch(err){
    res.send(err.message);
  }
});


router.post('/login', async (req, res) => {
  try{
    const {email, password} = req.body;
    const user = await User.findByCredentials(email, password);
    const userForms = await user.forms;
    SESSION_USER_ID = user._id
    res.render("patient", {formCount: userForms.length});
  }catch(err){
    res.send(err.message);
  }
});


router.get('/dash', async (req, res) => {
  try{
    if (!SESSION_USER_ID) {
      res.redirect('/login')
    }
    else{
      const user = await User.findById(SESSION_USER_ID);
      const userForms = await user.forms;
      res.render("patient", {formCount: userForms.length});
    }
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});


router.get('/visit/new', async (req, res) => {
  try{
    res.render("patient_new_visit");
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});


router.post('/visit/new', upload.single('file'), async (req, res) => {
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
      ownerId: SESSION_USER_ID
    });
    await form.save();
    res.redirect('/user/visit/all');
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});


router.get('/visit/all', async (req, res) => {
  try{
    res.render("patient_all_visit");
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

export {router};