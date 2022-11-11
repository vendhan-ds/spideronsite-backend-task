const mongoose = require("mongoose")
const encrypt= require("mongoose-encryption")

const userSchema = new mongoose.Schema({
	Name: { type: String, required: true },
	email: { type: String, required: true ,},
	password: { type: String, required: true },
    book:[
        {
            bookname:{type:String },
            authorname:{type:String },
            pages:{type:String}
        }
    ],
});

userSchema.plugin(encrypt,{secret:process.env.SECRET ,encryptedFields: ["password"]});

module.exports = mongoose.model('User',userSchema)