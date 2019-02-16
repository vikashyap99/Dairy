var express=require("express"),
bodyParser =require("body-parser"),
mongoose   =require("mongoose"),
methodOverride=require("method-override"),
app		   =express();

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));


app.get("/",function(req,res)
{
	res.render("index");
})

app.listen(3000,function()
{
	console.log("App is listening on port 3000");
})