//server stuff and dependendcies
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
app.set("view engine", "ejs")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
// var cookieParser = require('cookie-parser');
// app.use(cookieParser());

var cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

var bcrypt = require('bcrypt')

//creating my intital arry of urls
var urlDatabase = {
  default:{
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
  }
};
templateVars={
  uname: false,
  uemail: false,
  id: false 
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
  if (req.session.user_id){
    res.redirect("/urls"); }
  else {
    res.redirect("/login")
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/urls", (req, res) => {
    if (req.session.user_id){
    let uid= req.session.user_id;
    console.log(req.session.user_id)
    templateVars.uname= users[uid]['name'];
    templateVars.uemail=users[uid]['email'];
    templateVars.id=uid; 
  }
   templateVars.shortURL= req.params.id;
   templateVars.urls= urlDatabase;


  res.render("urls_index", templateVars);
});

//redirect urls function
app.get("/u/:shortURL", (req, res) => {
  // let longURL = ...
  let shortCode = req.params.shortURL;
  //let longURL = urlDatabase[code]

  function longURL(code){
    for( user in urlDatabase){
      if(urlDatabase[user][code]){
        return urlDatabase[user][code]

      }
    }
  }  
  var long= longURL(shortCode);

  res.redirect(long);
});

app.get("/urls/new", (req, res) => {
if (req.session.user_id){
    let uid= req.session.user_id  ;
    templateVars.uname= users[uid]['name'];
    templateVars.uemail= users[uid]['email'];
    templateVars.id=uid;
    templateVars.url; 
    console.log(req.session.user_id) 
  res.render("urls_new", templateVars);
  }
  else {
    templateVars.id="nope"
    res.render("register", templateVars);
  }

});

//view a url's profile by its id
app.get("/urls/:id", (req, res) => {
    var short = req.params.id;
    //console.log(urlDatabase[req.session.user_id][short]);
   if(req.session.user_id){
    if (urlDatabase[req.session.user_id][short]){
    let uid= req.session.user_id;
    templateVars.uname= users[uid]['name'];
    templateVars.uemail= users[uid]['email'];
    templateVars.id=uid;  
  } else {
    templateVars.id = "nope";
  }
  templateVars.shortURL = req.params.id;
  templateVars.urls= urlDatabase;
  res.render("urls_show", templateVars);
}else {
  res.redirect("/login")
}
});

app.get("/register", (req, res)=>{
   if (req.session.user_id){
    let uid= req.session.user_id;
    templateVars.uname= users[uid]['name'];
    templateVars.uemail= users[uid]['email'] 
  }
   res.render("register.ejs", templateVars)
  });

app.get("/login", (req, res)=>{
    if (req.session.user_id){
    let uid= req.session.user_id;
    templateVars.uname= users[uid]['name'];
    templateVars.uemail= users[uid]['email'] ; 
  }

  res.render('login.ejs', templateVars)
})



//             POSTS

//adds new URL
app.post("/urls", (req, res) => {
  var rando = generateRandomString();
  let uid= req.session.user_id;
  urlDatabase[uid][rando]= req.body.longURL;
  console.log(uid)
  console.log(urlDatabase)
  res.redirect(`/urls/${rando}`);       
});

app.post("/login", (req,res)=> {
    function findUser(email, password){
      for (emails in users) 
      console.log(users[emails]['email'])
      {
       if(users[emails]['email'] === email && bcrypt.compareSync(password,users[emails]['password'] )
)

       {
        return true
       } else {
        return false
       }
    }
  }
  var check = findUser(req.body.email, req.body.password);

  if (check === true){
       console.log(`${users[emails]['name']} just logged in.`);
         req.session.user_id =users[emails]['id'];
       //res.cookie("user_id", users[emails]['id']);
       res.redirect('/urls')
  } else {
    res.status(400);
      console.log("Login failed.")
      console.log(users)
      res.redirect("/login")
  }


});


app.post("/urls/:id/delete", (req, res) =>{
var test= req.params.id;
let uid = req.session.user_id;
delete urlDatabase[uid][test];
console.log ('attempting to delete' + test)
res.redirect("/urls")
});

app.post("/urls/:id/POST", (req, res) =>{
var test = req.params.id;
let uid = req.session.user_id;
urlDatabase[uid][req.params.id]= req.body.longURL
console.log ('attempting to change ' + test)
console.log(uid)
res.redirect("/urls")
});

app.post("/logout", (req,res)=>{
  console.log ("A user is logging out.")
  res.clearCookie('session');
  res.clearCookie('session.sig');

  res.redirect('/urls');
  templateVars.uname= false;
  templateVars.uemail= false;

  templateVars.id=false; 
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
          password: bcrypt.hashSync(req.body.password, 10)
          }
          req.session.user_id=newId;
      // res.cookie("user_id", newId)
      urlDatabase[newId]={};
      console.log (urlDatabase)
    }
    console.log(users)
    res.redirect('/urls')
});



app.listen(PORT, () => {
  console.log(`Matt\'s Tiny app listening on port ${PORT}!`);
});
