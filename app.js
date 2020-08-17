const mysql = require("mysql2");
const express = require("express");
const multer  = require("multer");
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const bcrypt = require( 'bcrypt' );
const expressHbs = require("express-handlebars");
const hbs = require("hbs");

const app = express();

const PORT = process.env.PORT || 3000

app.engine("hbs", expressHbs(
    {
        layoutsDir: "views/layouts", 
        defaultLayout: "layout",
        extname: "hbs"
    }
))
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

app.use(express.static(__dirname + "/static"))

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "remotemysql.com",
    port: 3306,
    user: "OF3TwtRr8O",
    password: "r3jeOW7DRo",
    database: "OF3TwtRr8O"
});

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./static/img/");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

app.use(multer({storage:storageConfig}).fields([{
    name : "filedata",
    maxCount: 1
}, {
    name: "downloadfile",
    maxCount: 1
}]));

app.get('/login', (req, res) => {
    res.render("login.hbs")
})
  
app.post("/login", function (req, res) {
    var username = req.body.username;
	var password = req.body.password; 
	if (username && password) {
		pool.query('SELECT * FROM admins WHERE email = ?', [username], function(error, results, fields) {
			if (bcrypt.compare(password, results[0].pass)) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/admin');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
})

app.get("/", function(req, res){
    pool.query("SELECT * FROM articles", function(err, data) {
        var posts = [];
        for (var i = data.length - 1; i >= 0; i--){
            posts.push(data[i])
        }
        var result = [];
        for (var g = 0; g < posts.length; g++){
            if (result.length < 10){
                result.push(posts[g])
            }
        }
        if(err) return console.log(err);
        res.render("index.hbs", {
            posts: result
        });
    });
});


app.get("/soft", function(req, res){
    var category = "soft"
    pool.query("SELECT * FROM articles WHERE category=?", [category], function(err, data) {
        var posts = [];
        for (var i = data.length - 1; i >= 0; i--){
            posts.push(data[i])
        }
        if(err) return console.log(err);
        res.render("soft.hbs", {
            posts: posts
        });
    });
});

app.get("/quizs", function(req, res){
    var category = "codewars"
    pool.query("SELECT * FROM articles WHERE category=?", [category], function(err, data) {
        var posts = [];
        for (var i = data.length - 1; i >= 0; i--){
            posts.push(data[i])
        }
        if(err) return console.log(err);
        res.render("quizs.hbs", {
            posts: posts
        });
    });
});

app.get("/posts", function(req, res){
    var category = "posts"
    pool.query("SELECT * FROM articles WHERE category=?", [category], function(err, data) {
        var posts = [];
        for (var i = data.length - 1; i >= 0; i--){
            posts.push(data[i])
        }
        if(err) return console.log(err);
        res.render("posts.hbs", {
            posts: posts
        });
    });
});

app.get("/admin", function (req, res) {
    if (req.session.loggedin){
        res.render("admin.hbs")
    } else {
        res.redirect("/login")
    }
})

// получаем отправленные данные и добавляем их в БД 
app.post("/admin", function (req, res) {
         
    if(!req.body) return res.sendStatus(400);
    const title = req.body.title
    const maintext = req.body.maintext;
    const imgfile = req.files["filedata"][0].filename;
    const img = "/img/" + imgfile
    var soft;
    if (typeof(req.files["downloadfile"]) != "undefined"){
        const softfile = req.files["downloadfile"][0].filename;
        soft = "/img/" + softfile
    } else {
        soft = null
    }
    const category = req.body.selectcategory;

    pool.query("INSERT INTO articles (title, maintext, img, category, downloadfile) VALUES (?,?,?,?,?)", [title, maintext, img, category, soft], function(err, data) {
      if(err) return console.log(err);
      res.redirect("/");
    });
});

app.get("/adminposts", function(req, res){
    if (req.session.loggedin){
        pool.query("SELECT * FROM articles", function(err, data){
            var posts = [];
            for (var i = data.length - 1; i >= 0; i--){
                posts.push(data[i])
            }
            if (err)
                return console.log(err);
            res.render("adminposts.hbs", {
                posts: posts
            })
        })
    } else {
        res.redirect("/login")
    }
})

app.post("/delete/:id", function(req, res){     
    const id = req.params.id;
    pool.query("DELETE FROM articles WHERE id=?", [id], function(err, data) {
      if(err) 
        return console.log(err);
      res.redirect("/adminposts");
    });
});

app.get("/article/:id", function(req, res){
    const id = req.params.id;
    pool.query("SELECT * FROM articles WHERE id=?", [id], function(err, data){
        if (err) 
            return console.log(err)
        var text = data[0].maintext.split("\n")
        if (data[0].downloadfile == null){
            res.render("article.hbs", {
                post: {
                    obj : data[0],
                    text : spliting(text)
                }
            })
        } else {
            res.render("softarticle.hbs", {
                post: {
                    obj : data[0],
                    text : spliting(text)
                }
            })
        }
    })
})

function spliting (fnarr){
    var midres = "";
    var arr = [];
    var result = [];
    for (var y = 0; y < fnarr.length; y++){
      arr.push(fnarr[y].trim())
    }
    for (var i = 0; i < arr.length; i++){
      if(arr[i] != "#"){
        if (typeof(arr[i]) != "undefined"){
          result.push(arr[i])
        }
      } else if (arr[i] == "#"){
        midres = arr[i]
        for (var g = i + 1; g < arr.length; g++){
          if (arr[g] == "#"){
            midres = midres + arr[g]
            delete arr[g]
            break
          } else if (arr[g] != "#"){
            midres = midres + arr[g] + "|"
            delete arr[g]
          }
        }
        result.push(midres)
        midres = null
      }
    } return result;
}

app.listen(PORT, function(){
    console.log("port 3000")
})

