const mongoose = require("mongoose");
require("dotenv").config();
// const mongoURL = "mongodb+srv://sudhir:sudhir@dbcluster.fr4o0.mongodb.net/database?retryWrites=true&w=majority";
mongoose.set('strictQuery', true);
var  mongoURL = process.env.MONGO_URL;


const connectToMongo = async()=>{
    mongoose.connect(mongoURL,{useNewUrlParser: true}  ,() => {
        console.log('connection with mongoDb established');
    })
}

module.exports = connectToMongo;
