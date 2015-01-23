'use strict'

var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var app = express();

var Todo;
var Category;

// connect to the database
mongoose.connect("mongodb://localhost/test");

var db = mongoose.connection;

db.once('open', function(cb){
    var categorySchema = mongoose.Schema({
        id:String,
        name:String,
        description:String
        });
    
   var todoSchema = mongoose.Schema({
      title: String,
      description: String,
      done: Boolean,
      categoryId: Number
    });
   
   Todo = mongoose.model("Todo", todoSchema);
   Category = mongoose.model("Category", categorySchema);
   
});

app.use(express.static(__dirname + "/app"));
app.use(bodyParser.json());

app.get("/todo", function(req, res){
    
    console.log("title = " + req.query.title);
    
    // get all todos from the database
    Todo.find({title:req.query.title}, function(err, todos){
        res.setHeader("Content-Type", "application/JSON");
        res.setHeader("Expires", "-1");
        res.setHeader("Cache-Control", "must-revalidate, private");
        res.send(todos)
        });
    
    });

app.get("/todos", function(req, res){
    
    var catid = req.query.catid;
    
    // get all todos from the database
    Todo.find({categoryId:catid}, function(err, todos){
        res.setHeader("Content-Type", "application/JSON");
         res.setHeader("Expires", "-1");
        res.setHeader("Cache-Control", "must-revalidate, private");
        res.send(todos)
        });
    
    }); 

app.post("/categories", function(req, res){
   
   Category.find({}, function(err, cats){
      var c = new Category()
      var lastcat = cats[cats.length-1];
      c.id = lastcat === undefined ? 1 : parseInt(lastcat.id) + 1;
      c.name = req.body.name;
      c.description = req.body.description;
      c.save();
      res.end("success");  
    });
    
});

app.post("/todos", function(req, res){
    console.log("new todo..." + req.body.title + ", " + req.body.description);

    var t = new Todo();
    t.title = req.body.title;
    t.description = req.body.description;
    t.categoryId = req.body.categoryId;
    t.done = false;
    t.save();
    
    res.end("success");
});

app.post("/todo", function(req, res){

     Todo.find({title:req.query.title}, function(err, todos){
        res.setHeader("Content-Type", "application/JSON");
        res.setHeader("Expires", "-1");
        res.setHeader("Cache-Control", "must-revalidate, private");
        todos[0].title = req.body.title;
        todos[0].description = req.body.description;
        todos[0].categoryId = req.body.categoryId;
        todos[0].done = req.body.done;
        todos[0].save();
    
        res.end("success");
        });
});

app.get("/categories", function(req, res){
    // get all todos from the database
    Category.find({}, function(err, cats){
        res.setHeader("Content-Type", "application/JSON");
        res.setHeader("Expires", "-1");
        res.setHeader("Cache-Control", "must-revalidate, private");
        res.send(cats)
        });
    }); 
    
app.listen(80);

console.log("listening for stuff....")