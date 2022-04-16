import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import './config/mongo.js';

const app = express();
const port = process.env.PORT || 3000;


app.use(express.static('static/css'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.set("view engine","ejs");


app.get('/', (req, res) => {
  try{
    res.render("login");
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});


app.listen(port, () => {
  console.log(`Server is running at PORT: ${port}`);
});