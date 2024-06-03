const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
    return res.status(404).json({message: "Unable to register user."});
});
  
  

/* ******************************* */
 //NEW functions with axios async/await
/* ******************************* */
//10
function getbooks(){
  return new Promise((resolve) => {
    let booklist={};
    booklist=JSON.stringify(books,null,4);
    resolve(booklist);
  });
}

public_users.get('/', async function (req, res) {
  try{
    let response = await getbooks();
    res.send(response); 
  } catch (error){
    console.error(`Error occurred: ${error}`);
    return res.status(300).json({message: "Error occured"});
  }
});

//11
function getbooksI(isbn) {
  return new Promise((resolve) => {
    let booklist={};
    booklist=books[isbn];
    resolve(booklist);
  });
}

public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn;
  try{
    let response = await getbooksI(isbn);
    res.send(response); 
  } catch (error){
    console.error(`Error occurred: ${error}`);
    return res.status(300).json({message: "Error occured"});
  }
 });

//12
function getbooksA(author) {
  return new Promise((resolve) => {
    let booklist={};
    Object.keys(books).forEach((isbn) => {
      if(books[isbn].author === author){
        booklist[isbn]=books[isbn];
      }
    });
    console.log(booklist)
    resolve(booklist);
  });
}

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try{
    let response = await getbooksA(author);    
    res.send(response); 
  } catch (error){
    console.error(`Error occurred: ${error}`);
    return res.status(300).json({message: "Error occured"});
  } 
});

//13
function getbooksT(title) {
  return new Promise((resolve) => {
    let booklist={};
    Object.keys(books).forEach((isbn) => {
      if(books[isbn].title === title){
        booklist[isbn]=books[isbn].title;
      }
    });
    console.log(booklist)

    resolve(booklist);
  });
}

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
   try{
    let response = await getbooksT(title);
    res.send(response); 
  } catch (error){
    console.error(`Error occurred: ${error}`);
    return res.status(300).json({message: "Error occured"});
  } 
});


/* ******************************* */
 //Old functions without axios async/await
/* ******************************* */
/*
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  
  res.send(JSON.stringify(books,null,4));

  //return res.status(300).json({message: "Yet to be implemented"});
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  Object.keys(books).forEach((isbn) => {
      if(books[isbn].author === author){
        return res.send(books[isbn]);
      }
  });
   
  //return res.status(300).json({message: "No book found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  
  const title = req.params.title;
  Object.keys(books).forEach((isbn) => {
      if(books[isbn].title === title){
        return res.send(books[isbn]);
      }
  });

  //return res.status(300).json({message: "Yet to be implemented"});
});
*/

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
