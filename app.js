var express=require("express"),
bodyParser =require("body-parser"),
mongoose   =require("mongoose"),
methodOverride=require("method-override"),
app		   =express();

//APP CONFIG
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/dairy_db");

//MONGOOSE/MODEL CONFIG
var appSchema= new mongoose.Schema(
{
	name:String,
	phoneNumber:String
})

var Customer = mongoose.model("Customer",appSchema);

// Customer.create(
// {
// 	name:"J Prem Shanker",
// 	phoneNumber:"8511696345"
// })

app.get("/",function(req,res)
{
	res.render("index2");
})
//INDEX ROUTE
app.get("/customers",function(req,res)
{	
	Customer.find({},function(err,customers)
	{
		if(err)
		{
			res.redirect("/customers");
		}else
		{
			res.render("index",{customers:customers});
		}
	})
	
})
// NEW ROUTE
app.get("/customers/new",function(req,res)
{
	res.render("new");
})
//CREATE ROUTE
app.post("/customers",function(req,res)
{
	Customer.create(req.body.customer,function(err,newCustomer)
	{
		if(err)
		{
			res.redirect("new");
		}else
		{
			res.redirect("/customers");
		}
	})
})
//SHOW ROUTE
app.get("/customers/:id",function(req,res)
{
	Customer.findById(req.params.id,function(err,foundCustomer)
	{
		if(err)
		{
			res.redirect("/customers");
		}else
		{
			res.render("show",{customer:foundCustomer});
		}
	})
})
//EDIT ROUTE
app.get("/customers/:id/edit",function(req,res)
{
	Customer.findById(req.params.id,function(err,foundCustomer)
	{
		if(err)
		{
			res.redirect("/customers/req.params.id");
		}else
		{
			res.render("edit",{customer:foundCustomer});
		}
	})
})
//UPDATE ROUTE
app.put("/customers/:id",function(req,res)
{
	Customer.findByIdAndUpdate(req.params.id,req.body.customer,function(err,updatedCustomer)
	{
		if(err)
		{
			res.redirect("/customers");
		}else
		{
			res.redirect("/customers/"+req.params.id);
		}
	})
})
// DESTROY
app.delete("/customers/:id",function(req,res)
{
	//destroy Blog
	Customer.findByIdAndRemove(req.params.id,function(err)
	{
		if(err)
		{
			res.redirect("/customers");
		}else
		{
			res.redirect("/customers");
		}
	})
})
//CONTACT 
app.get("/contact",function(req,res)
{
	res.render("contact");
})

app.listen(process.env.PORT||3000,function()
{
	console.log("App is listening on port 3000");
})