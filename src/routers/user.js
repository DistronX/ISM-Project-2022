import express from 'express';

const router = new express.Router();


router.get('/signup', async (req, res) => {
  try{
    res.render("signup");
  }catch(err){
    res.send(err.message);
  }
});

router.post('/signup', async (req, res) => {
  try{
    console.log(req.body);
    res.send("ok fine");
  }catch(err){
    res.send(err.message);
  }
})

export {router};