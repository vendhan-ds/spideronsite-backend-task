
//require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser")
const ejs=require("ejs")
const mongoose=require("mongoose")
const md5=require("md5")

const User = require('./models/user')
const Book = require('./models/book')

const app=express()

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

//mongodb+srv://vendhan:vendhan0505@cluster0.2scrfba.mongodb.net/?retryWrites=true&w=majority

mongoose.connect('mongodb://127.0.0.1/booktrack',{ useNewUrlParser: true,  }
);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})


app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register", function(req,res){
    const newUser= new User({
        Name: req.body.username,
        email:req.body.usermail,
        password:md5(req.body.password),
   })
    console.log(req.body)
    newUser.save(function(err){
        if (err){
            console.log(err);
        }else{
            res.redirect("login")
        }
    })
})

var username;
var list=[];

app.post("/login",function(req,res){
    username=req.body.username
    const password=md5(req.body.password)

    User.findOne({Name:username}, function(err, foundUser){
        if(err){
            console.log(list)
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password===password){
                    list=foundUser.book
                    res.redirect("/middleman");
                    //next()
                    //res.render("userpage",{name: username, booklist:foundUser.book})
                }
            }
        }
    })
})

app.get("/middleman",function(req,res){
    console.log(username,list)
    res.render("userpage",{name: username, booklist:list})

})



app.post("/userpage", function(req,res){
    var username=req.body.username
    var bookname=req.body.bookname
    var authorname=req.body.authorname
    var pagesread=req.body.pagesread
   //const submit=req.body.submit
    //var list;
    var bookobt={bookname:bookname,
                    authorname:authorname,
                    pages:pagesread};

    if(req.body.submit=="add"){              
        User.findOneAndUpdate({Name:username},{$push: {book:bookobt}}, function(err, foundUser){
            if(err){
            console.log(err);
            }else{
            //console.log(list)
            list=foundUser.book;
            console.log(list)
            //res.redirect('userpage')
            //res.render("userpage",{name: username, booklist: list,})
            }
            }
        )
    }
    else if(req.body.submit=="update"){
        User.findOne({Name:username} ,function(err, foundUser){
            console.log("hi")
            if(err){
            console.log(err);
            }else{
            if(foundUser){
                
                list=foundUser.book.forEach(element=>{
                    if(element.bookname==bookname){
                        element.bookname=bookname,
                        element.authorname=authorname,
                        element.pages=pagesread
                    }
                })
                if(list){
                    User.findOneAndUpdate({Name:username},{$set: {book:list,}})
                }else(err)
                //list=foundUser.book
                console.log(list)
                //console.log(foundUser.book);
                //console.log()
            }
        }})
       // list= await User.findOneAndUpdate({Name:username},{$set: {book:list,}})
        ;}
    else{
        User.findOne({Name:username}, function(err, foundUser){
            if(err){
            console.log(err);
            }else{
                console.log("hiioi")
                list=foundUser.book.filter(function(item){
                    return item.bookname!=bookname
                })
                //list=foundUser.book
                
            User.findOneAndUpdate({Name:username},{$set: {book:list}})
                console.log(foundUser.book)
                
            }
        });
        
    }
    
    res.redirect("middleman") 

})

app.get("/logout", function(req,res){
    res.render("home");
})



app.listen(3000,function(){
    console.log("server started on port 3000")
})