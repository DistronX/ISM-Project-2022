import express from 'express';
import { decryptText } from '../lib/common_utils.js';

import { Doctor } from '../models/doctor.js';
import { Form } from '../models/form.js';

const router = new express.Router();

let SESSION_USER_ID = '';
router.get('/signup', async (req, res) => {
  try{
    res.render("doctor_signup");
  }catch(err){
    res.send(err.message);
    res.render("500");
  }
});

router.post('/signup', async (req, res) => {
  try{
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.redirect("/login");
  }catch(err){
    res.render("500");
  }
});

router.post('/login', async (req, res) => {
  try{
    const {email, password} = req.body;
    const doctor = await Doctor.findByCredentials(email, password);
    const doctorForms = await Form.find({doctor: doctor.name})
    SESSION_USER_ID = doctor._id;
    res.render("doctor", {doctorName: doctor.name, selfFormCount: doctorForms.length});
  }catch(err){
    res.render("500");
  }
});


router.get('/dash', async (req, res) => {
  try{
    if (!SESSION_USER_ID){
      res.redirect('/login');
    }
    else{
      const doctor = await Doctor.findById(SESSION_USER_ID);
      const doctorForms = await Form.find({doctor: doctor.name})
      res.render("doctor", {doctorName: doctor.name, selfFormCount: doctorForms.length})
    }
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

router.get('/visits/all', async (req, res) => {
  try{
    if (!SESSION_USER_ID){
      res.redirect('/login');
    }
    else{
      const doctor = await Doctor.findById(SESSION_USER_ID);
      const allForms = await Form.find({});
      allForms.forEach((form) => {
        const encImg = form.documentMeta.enc_rel_path.split('/')[form.documentMeta.enc_rel_path.split('/').length - 1];
        const decImg = form.documentMeta.dec_rel_path.split('/')[form.documentMeta.dec_rel_path.split('/').length - 1];
        form.imageToDisplay = (form.doctor == doctor.name) ? decImg : encImg;
        form.message = (form.doctor == doctor.name) ? decryptText(form.message) : form.message;
      })
      res.render("doctor_all", {doctorName: doctor.name, forms: allForms});
    }
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

router.get('/visits/my', async (req, res) => {
  try{
    if (!SESSION_USER_ID){
      res.redirect('/login');
    }
    else{
      const doctor = await Doctor.findById(SESSION_USER_ID);
      const allForms = await Form.find({doctor: doctor.name});
      allForms.forEach((form) => {
        const decImg = form.documentMeta.dec_rel_path.split('/')[form.documentMeta.dec_rel_path.split('/').length - 1];
        form.imageToDisplay = decImg;
        form.message = decryptText(form.message);
      })
      res.render("doctor_my", {doctorName: doctor.name, forms: allForms});
    }
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

export {router};