import express from 'express';

const router = new express.Router();


// Internal Imports
import { User } from '../models/user.js';
import { Form } from '../models/form.js';
import { upload } from '../lib/upload.js';
import { decryptImage, encryptImage } from '../lib/image_utils.js';
import { decryptText, encryptText } from '../lib/common_utils.js';
import { Doctor } from '../models/doctor.js';


let SESSION_USER_ID = undefined;

router.get('/signup', async (req, res) => {
  try{
    res.render("user_signup");
  }catch(err){
    res.render("500");
  }
});


router.post('/signup', async (req, res) => {
  try{
    const user = new User(req.body);
    await user.save();
    res.redirect('/login');
  }catch(err){
    res.render("500");
  }
});


router.post('/login', async (req, res) => {
  try{
    const {email, password} = req.body;
    const user = await User.findByCredentials(email, password);
    const userForms = await Form.find({ownerId: user._id});
    SESSION_USER_ID = user._id
    res.render("patient", {formCount: userForms.length, userName: user.name});
  }catch(err){
    res.render("404");
  }
});


router.get('/dash', async (req, res) => {
  try{
    if (!SESSION_USER_ID) {
      res.redirect('/login')
    }
    else{
      const user = await User.findById(SESSION_USER_ID);
      const userForms = await Form.find({ownerId: user._id});
      res.render("patient", {formCount: userForms.length, userName: user.name});
    }
  }catch(err){
    console.log(err);
    res.render("500");
  }
});


router.get('/visit/new', async (req, res) => {
  try{
    if (!SESSION_USER_ID) {
      res.redirect('/login')
    }
    else{
      const user = await User.findById(SESSION_USER_ID);
      let doctorList = await Doctor.find({});
      doctorList = doctorList.map((doctor) => doctor.name);
      res.render("patient_new_visit", {userName: user.name, doctors: doctorList});
    }
  }catch(err){
    console.log(err);
    res.render("500");
  }
});


router.post('/visit/new', upload.single('file1'), async (req, res) => {
  try{
    if (!SESSION_USER_ID) {
      res.redirect('/login')
    }
    else{
      const {file, body} = req;
      const filePath = file.path;
      const {encrypted_image, mask, shape, enc_rel_path} = await encryptImage(filePath);
      const {decrypted_image, dec_rel_path} = await decryptImage(encrypted_image, mask, shape);
      const form = new Form({
        documentMeta: {
          enc_path: encrypted_image,
          dec_path: decrypted_image,
          enc_rel_path: enc_rel_path.split('/')[enc_rel_path.split('/').length - 1],
          dec_rel_path: dec_rel_path.split('/')[dec_rel_path.split('/').length - 1],
          mask: mask,
          shape: shape,
        },
        message: encryptText(body.message),
        ownerId: SESSION_USER_ID,
        doctor: body.doctor
      });
      await form.save();
      const user = await User.findById(SESSION_USER_ID);
      let forms = await Form.find({ownerId: user._id});
      forms.forEach((form) => {
        form.message = decryptText(form.message);
      });
      res.render('patient_all_visit',  {forms: forms, userName: user.name}); 
    }
  }catch(err){
    console.log(err);
    res.render("500");
  }
});


router.get('/visit/all', async (req, res) => {
  try{
    if (!SESSION_USER_ID) {
      res.redirect('/login');
    }
    else{
      const user = await User.findById(SESSION_USER_ID);
      let forms = await Form.find({ownerId: user._id});
      forms.forEach((form) => {
        form.message = decryptText(form.message);
      });
      res.render("patient_all_visit", {forms: forms, userName: user.name});
    }
  }catch(err){
    console.log(err);
    res.render("500");
  }
});

export {router};