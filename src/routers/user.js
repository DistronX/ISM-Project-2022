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

export {router};