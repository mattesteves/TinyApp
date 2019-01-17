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
templateVars={
  uname: false
}
const users= {
  ExampleBoy:{
    id: generateRandomString(),
    name: "Example",
    email: "ex@amp.le",
    password: "password"
  }
};

function generateRandomString() {
  var allChars= ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',1,2,3,4,5,6,7,8,9,0]
    var tempArr=[];
  for (i=0; i <= 5; i++){
    let x = Math.floor(Math.random()* 35);
    tempArr.push(allChars[x]);
  }
  return tempArr.join('')
};


//                  GET
//if nothing is sent from the url
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//lists all URLs
app.get("/urls", (req, res) => {
    if (req.cookies.user_id){
    let uid= req.cookies.user_id;
    templateVars.uname= users[uid]['name'] 
  }
   templateVars.shortURL= req.params.id;
   templateVars.urls= urlDatabase;


  res.render("urls_index", templateVars);
});

//redirect urls function
app.get("/u/:shortURL", (req, res) => {
  // let longURL = ...
  let code = req.params.shortURL;
  let longURL = urlDatabase[code];

  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  let templateVars= {
      username:req.cookies["user_id"]
  }
  res.render("urls_new", templateVars);

});

//view a url's profile by its id
app.get("/urls/:id", (req, res) => {
   if (req.cookies.user_id){
    let uid= req.cookies.user_id;
    templateVars.uname= users[uid]['name'] 
  }
  templateVars.shortURL = req.params.id;
  templateVars.urls= urlDatabase;
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res)=>{
   if (req.cookies.user_id){
    let uid= req.cookies.user_id;
    templateVars.uname= users[uid]['name'] 
  }
   res.render("register.ejs", templateVars)
  });

app.get("/login", (req, res)=>{
    if (req.cookies.user_id){
    let uid= req.cookies.user_id;
    templateVars.uname= users[uid]['name'] 
  }

  res.render('login.ejs', templateVars)
})



//             POSTS

//adds new URL
app.post("/urls", (req, res) => {
  var rando = generateRandomString();
  urlDatabase[rando]= req.body.longURL;
  res.redirect(`/urls/${rando}`);       
});

app.post("/login", (req,res)=> {
    function findUser(email, password){
      for (emails in users)
      {
       if(users[emails]['email'] === email && users[emails]['password'] === password){
        return true
       } else {
        return false
       }
    }
  }
  var check = findUser(req.body.email, req.body.password);

  if (check === true){
       console.log(`${users[emails]['name']} just logged in.`);
       res.cookie("user_id", users[emails]['id']);
       res.redirect('/urls')
  } else {
    res.status(400);
      res.redirect("/login")
  }


});

app.post("/logout", (req,res)=>{
  console.log ("A user is logging out.")
  res.clearCookie("user_id")
  res.redirect('/urls')
  templateVars.uname= false;
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


app.post("/register", (req,res)=>{
  var check = false;
  let errorMes= '';
  for (username in users){
    if (users[username]['email'] === req.body.email){
      check = true;
      errorMes='User registration failed, email already exists.';
    }
   }
    if (!req.body.email || !req.body.password){
      res.status(400);
      check= true
      errorMes= 'User registration failed, invalid e-mail or password.'
    }
    if (check === true){
      res.status(400);
      console.log(errorMes)}
    else {
      let newId=generateRandomString(); 

      users[newId]=
         {
          id: newId, 
          name: req.body.id,
          email: req.body.email,
          password: req.body.password
          }
      res.cookie("user_id", newId)
      
    }
    
    res.redirect('/urls')
});



app.listen(PORT, () => {
  console.log(`Matt\'s Tiny app listening on port ${PORT}!`);
});
