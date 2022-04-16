import express from 'express';

const router = new express.Router();


router.get('/signup', async (req, res) => {
  try{
    res.render("login");
  }catch(err){
    res.send(err.message);
  }
});

router.post('/signup', async (req, res) => {
  try{
    
  }catch(err){
    res.send(err.message);
  }
})

export {router};