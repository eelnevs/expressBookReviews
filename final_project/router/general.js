const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push({
        username: username,
        password: password
      })
      res.send(`Successfully registered user ${username}. Now you can login.`)
    }
    else res.send(`${username} already exists!`)
  }
  else res.status(400).json({message:"Please enter both username and password to register."})
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  //Write your code here
  let bookfound = books[req.params.isbn];
  if (bookfound) res.send(bookfound);
  else res.send("No book found by that isbn");
 });
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  //Write your code here
  let author = req.params.author;
  let isbns = Object.keys(books);
  let booksfound = {};
  for (let isbn of isbns) {
    if (books[isbn].author.toLowerCase() == author.toLowerCase()) booksfound[isbn] = books[isbn];
  }
  if (Object.keys(booksfound).length > 0) res.send(booksfound)
  else res.send(`No book written by ${author} is found`)
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  //Write your code here
  let title = req.params.title;
  let isbns = Object.keys(books);
  let booksfound = {};
  for (let isbn of isbns) {
    if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) booksfound[isbn] = books[isbn];
  }
  if (Object.keys(booksfound).length > 0) res.send(booksfound);
  else res.send(`Cannot find book by title: ${title}`);
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  //Write your code here
  let book = books[req.params.isbn]
  if (book) res.send(book.reviews)
  else res.send(`No book found with ISBN ${req.params.isbn}`);
});

module.exports.general = public_users;
