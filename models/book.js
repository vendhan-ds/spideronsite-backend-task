const mongoose = require("mongoose")
const bookSchema = new mongoose.Schema({
    name:String,
    bookname:String,
    Author:String,
    Pages:String
})
module.exports= mongoose.model("Book",bookSchema)