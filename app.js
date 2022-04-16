import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import './config/mongo.js';
import {router as UserRouter} from './src/routers/user.js';
import {router as DoctorRouter} from './src/routers/doctor.js';

const app = express();
const port = process.env.PORT || 3000;


app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.set("view engine","ejs");


app.use('/user', UserRouter);
app.use('/doctor', DoctorRouter);

app.get('/', (req, res) => {
  try{
    res.render("user_signup");
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

app.get('/doctorsignup', (req, res) => {
  try{
    res.render("doctor_signup");
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

app.get('/usersignup', (req, res) => {
  try{
    res.render("user_signup");
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});


app.listen(port, () => {
  console.log(`Server is running at PORT: ${port}`);
});