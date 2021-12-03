const mongoose = require('mongoose');
require('dotenv').config();
mongoose.Promise = global.Promise

const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.nhs71.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
// console.log(connectionString)
mongoose.connect(connectionString,{
   useNewUrlParser: true,
   useUnifiedTopology: true 
})

const conn = mongoose.connection
conn.on('error', console.error.bind(console, 'connection error:'))
conn.on('open',()=>{
    console.info('Connected to MongoDB!')
})

module.exports = conn