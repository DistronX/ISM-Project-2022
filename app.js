import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import './config/mongo.js';
import {router as UserRouter} from './src/routers/user.js';
import {router as DoctorRouter} from './src/routers/doctor.js';
import {router as FormRouter} from './src/routers/form.js';

const app = express();
const port = process.env.PORT || 3000;


app.use(express.static('static'));
app.use(express.static('Test/process'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.set("view engine","ejs");


app.use('/user', UserRouter);
app.use('/doctor', DoctorRouter);
app.use('/form', FormRouter);

app.get('/', (req, res) => {
  try{
    res.render("index");
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});


app.get('/login', (req, res) => {
  try{
    res.render("login");
  }catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

app.get('/logout', (req, res) => {
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