import express from 'express';
import { User } from '../models/user.js';

const router = new express.Router();


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
    res.send(user);
  }catch(err){
    res.send(err.message);
  }
});

router.get('/dash', async (req, res) => {
  try{
    res.render("patient");
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

router.get('/newvisit', async (req, res) => {
  try{
    res.render("patient_new_visit");
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

router.get('/prevvisits', async (req, res) => {
  try{
    res.render("patient_prev_visit");
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

export {router};