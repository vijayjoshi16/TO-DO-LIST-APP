//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const _=require('lodash')

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/toDoList',{useNewUrlParser:true});

// CREATE SCHEMA FOR THE COLLECTION
const listItemSchema={
    name:String,
    description:String
};

const Item=mongoose.model("Item",listItemSchema);

app.get("/",function(req,res){
    Item.find({},function(err,currentItems){
        //SHOW ALL ITEMS IN THE DATABASE ON THE WEB PAGE    
        res.render("index",{listItems : currentItems});
    });
});

app.post("/",function(req,res){
    //GET REQUIRED DETAILS OF NEW TASK TO BE DONE
    const taskName=req.body.newItemName;
    const taskDescription=req.body.newItemDescription;
    const task=new Item({
        name:taskName,
        description:taskDescription
    });
    task.save();
    res.redirect("/");
})

app.post("/delete",function(req,res){
    //GET ID OF TASK CHECKED TO BE DONE
    const itemId=req.body.checkbox;
    //DELETE THE GIVEN TASK FROM
    Item.findByIdAndRemove(itemId,function(err){
        if(!err){
            console.log("Item deleted successfully!");
            res.redirect("/");
        }else{
            console.log(err);
        }
    });
});

app.listen(3000, function() {
    console.log("Server has started successfully");
  });
  