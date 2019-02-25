var express=require("express"),
bodyParser =require("body-parser"),
mongoose   =require("mongoose"),
methodOverride=require("method-override"),
passport     = require("passport"),
LocalStrategy=require("passport-local"),
Customer       = require("./models/customer"),
User 		   =require("./models/User"),
app		   =express();

//APP CONFIG
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/dairy_db");

// Passport authentication

app.use(require("express-session")({
	secret:"Rust wins the cutest dog again",
	resave:false,
	saveUninitialize:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next)
{
	res.locals.currentUser=req.user;
	next();
});

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
app.get("/customers",isLoggedIn,function(req,res)
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
app.get("/customers/new",isLoggedIn,function(req,res)
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
app.get("/customers/:id",isLoggedIn,function(req,res)
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
app.get("/customers/:id/edit",isLoggedIn,function(req,res)
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
app.put("/customers/:id",isLoggedIn,function(req,res)
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
app.delete("/customers/:id",isLoggedIn,function(req,res)
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

//=======================
// AUTH ROUTE
//======================= 

// show register form
app.get("/register",function(req,res)
{
	res.render("register");
})

// handle signup logic
app.post("/register",function(req,res)
{
	var newUser=new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user)
		{
			if(err)
			{
				console.log(err);
				return res.render("register");
			}
			passport.authenticate("local")(req,res,function()
			{
				res.redirect("/customers");
			})
		});
});


// Login 

app.get("/login",function(req,res)
{
	res.render("login");
})

app.post("/login",passport.authenticate("local",{
	successRedirect : "/",
	failureRedirect:"/login"
	}),function(req,res){
});

// logout route
app.get("/logout",function(req,res)
{
	req.logout();
	res.redirect("/customers");
});

function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated())
	{
		return next();
	}
	res.redirect("/login");
}

app.listen(process.env.PORT||3000,function()
{
	console.log("App is listening on port 3000");
})