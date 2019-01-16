//server stuff and dependendcies
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
app.set("view engine", "ejs")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var cookieParser = require('cookie-parser');
app.use(cookieParser());

//creating my intital arry of urls
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//if nothing is sent from the url
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/logout", (req,res)=>{
  res.clearCookie("name")
  res.redirect('/urls')
});

app.post("/login", (req,res)=> {
  res.cookie("name",req.body.username)
  console.log(`${req.body.username} just logged in.`);
  console.log(req.cookies)
  res.redirect('/urls')

});


//lists all URLs
app.get("/urls", (req, res) => {
  let templateVars = {
   shortURL: req.params.id,
   urls: urlDatabase,
   username:req.cookies["name"]
   };

  res.render("urls_index", templateVars);
});


//adds new URL
app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement 
  var rando = generateRandomString();
  urlDatabase[rando]= req.body.longURL;
  console.log(rando) // random string logged to console
  res.redirect(`/urls/${rando}`);       
});

//redirect urls function
app.get("/u/:shortURL", (req, res) => {
  // let longURL = ...
  let code = req.params.shortURL;
  console.log(code)
  let longURL = urlDatabase[code];

  res.redirect(longURL);
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


//view a url's profile by its id
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
  urls: urlDatabase  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id/delete", (req, res) =>{
var test= req.params.id
delete urlDatabase[req.params.id]
console.log ('attempting to delete' + test)
res.redirect("/urls")
});

app.post("/urls/:id/POST", (req, res) =>{
var test = req.params.id;
urlDatabase[req.params.id]= req.body.longURL
console.log ('attempting to change ' + test)
res.redirect("/urls")
});

function generateRandomString() {
  var allChars= ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',1,2,3,4,5,6,7,8,9,0]
    var tempArr=[];
  for (i=0; i <= 5; i++){
    let x = Math.floor(Math.random()* 35);
    tempArr.push(allChars[x]);
  }
  return tempArr.join('')
};

app.listen(PORT, () => {
  console.log(`Matt\'s Tiny app listening on port ${PORT}!`);
});


// app.get("/hello", (req, res) => {
//   var template = "<html><body>{var}Hello <b>World</b></body></html>\n"
//   res.send(template.replace('{var}', 'this'));
// });