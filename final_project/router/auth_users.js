const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
  
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
//  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbnM = req.params.isbn;
  const reviewM = req.query.review;
  const usernameM=req.session.authorization['username'];
  
  //update or add new review
  Object.keys(books[isbnM].reviews).filter( (username) => {
    if (username === usernameM){
      books[isbnM].reviews[usernameM]= JSON.stringify(reviewM);
    }
    console.log(username + " vs " +usernameM);
  });
  books[isbnM].reviews[usernameM]=reviewM;
  return res.status(300).json({message: "Review of book isbn " + isbnM + " added or revised."});
  
  //books[isbnM].review +=usernameM+ ":"+ reviewM;
  //return res.status(300).json({message: "Review of book isbn " + isbnM + " added."});

});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbnM = req.params.isbn;
  const usernameM=req.session.authorization['username'];
  let deletedM=false;
  
  //update or add new review
  Object.keys(books[isbnM].reviews).filter( (username) => {
    if (username === usernameM){
      delete books[isbnM].reviews[usernameM];
      deletedM=true;
    }
  });
  
  if(deletedM){
    return res.status(300).json({message: "Review of user " + usernameM  + " for the book isbn " + isbnM + " has been removed."});
  } else{
    return res.status(300).json({message: "Review of user " + usernameM  + " for the book isbn " + isbnM + " not found."});
  }
  
  //books[isbnM].review +=usernameM+ ":"+ reviewM;
  //return res.status(300).json({message: "Review of book isbn " + isbnM + " added."});

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
