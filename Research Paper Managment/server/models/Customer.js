const mongoose = require('mongoose');
// Define schema and model for MongoDB
const userSchema = new mongoose.Schema({
  Title: String,
  Authors: [String],
  Journal: String,
  Volume: String,
  Pages: String,
  BookTitle: String,
  Organization: String,
  Publisher: [String],
  Number: String,
  Year: String
});
const User = mongoose.model('users', userSchema);
console.log("Schema and model defined");
module.exports = User;