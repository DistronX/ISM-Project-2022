import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import './config/mongo.js';

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json({limit: '10mb', extended: true}))
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.set("view engine","ejs");


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