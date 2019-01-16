var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
app.set("view engine", "ejs")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//server stuff and dependendcies


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//creating my intital arry of urls

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  var template = "<html><body>{var}Hello <b>World</b></body></html>\n"
  res.send(template.replace('{var}', 'this'));
});

// just tests

app.get("/urls", (req, res) => {
  let templateVars = { shortURL: req.params.id, urls: urlDatabase
   };
  res.render("urls_index", templateVars);
});

//lists urls

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement 
  var rando = generateRandomString();
  urlDatabase[rando]= req.body.longURL;
  console.log(rando) // random string logged to console
  res.redirect(`/urls/${rando}`);       
});

app.get("/u/:shortURL", (req, res) => {
  // let longURL = ...
  let longURL = req.body.longURL;

  res.redirect(longURL);
});
//redirect urls function


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
//add urls


app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
  urls: urlDatabase  };
  res.render("urls_show", templateVars);
});
//view a url's profile by its id


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
  console.log(`Example app listening on port ${PORT}!`);
});