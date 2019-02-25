var mongoose = require("mongoose");

//MONGOOSE/MODEL CONFIG
var appSchema= new mongoose.Schema(
{
	name:String,
	phoneNumber:String
})

module.exports = mongoose.model("Customer",appSchema);