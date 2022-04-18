import mongoose from 'mongoose';

let DbUri = "mongodb://127.0.0.1:27017/ISM-Project-2022-KA";

const dbProperties = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(DbUri, dbProperties).then(()=>{
  console.log("Connection to Mongo successful");
}).catch((err) => {
  console.log(err.message);
  process.exit();
});