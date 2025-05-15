const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/irdBtp");

//check database connection

connect.then(() => {
    console.log("Database connected Successfully to username collection");
})

.catch(() => {
    console.log("Database not connected");
});

// Create a Schema

const LoginSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }    

});

const collection = new mongoose.model("username", LoginSchema);
module.exports = collection;

