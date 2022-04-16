import express from 'express';

import './config/mongo.js';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  try{
    res.status(200).send('OK fine');
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});


app.listen(port, () => {
  console.log(`Server is running at PORT: ${port}`);
});