const mongoose = require("mongoose");
// require("dotenv").config();
// const mongoURL = "mongodb+srv://sudhir:sudhir@dbcluster.fr4o0.mongodb.net/database?retryWrites=true&w=majority";
mongoose.set('strictQuery', true);
const mongoURL = "mongodb+srv://thevolint:Varanasi123@cluster0.agvtksn.mongodb.net/?retryWrites=true&w=majority"

const connectToMongo = async()=>{
    mongoose.connect(mongoURL,  () => {
        console.log('connection with mongoDb established');
    })
}

module.exports = connectToMongo;
