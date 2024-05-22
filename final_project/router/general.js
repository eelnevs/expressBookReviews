const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let axios = require('axios').default;

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

let getAllBooks = new Promise((resolve, reject) => {
  if(books) resolve(books);
  else reject("Cannot load books");
})

function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      getAllBooks.then(data => {
        let bookfound = data[isbn];
        if (bookfound) resolve(bookfound);
        else reject("No book found by that isbn");
      }).catch(err => reject(err));
    })
}

function getBooksByProperty(property, propertyName) {
  return new Promise((resolve, reject) => {
    getAllBooks.then(data => {
      let isbns = Object.keys(data);
      let booksfound = {};
      for (let isbn of isbns) {
        if (data[isbn][propertyName].toLowerCase().includes(property)) booksfound[isbn] = data[isbn];
      }
      if (Object.keys(booksfound).length > 0) resolve(booksfound)
      else reject(`Cannot find book by ${property}`)
    }).catch(err => reject(err));
  })
}

function getBookReviews(isbn) {
  return new Promise((resolve, reject) => {
    getAllBooks.then(data => {
      let book = data[isbn];
      if (book) resolve(book.reviews);
      else reject(`No book found with ISBN ${isbn}`);
    }).catch(err => reject(err));
  })
}

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  //Write your code here
  // res.send(JSON.stringify(books, null, 4));

  // using Promise
  getAllBooks.then(data => res.send(data)).catch(err => res.send(err));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  //Write your code here
  // let bookfound = books[req.params.isbn];
  // if (bookfound) res.send(bookfound);
  // else res.send("No book found by that isbn");

  // using Promise
  getBookByISBN(req.params.isbn).then(data => res.send(data)).catch(err => res.send(err));
 });
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  //Write your code here
  // let author = req.params.author;
  // let isbns = Object.keys(books);
  // let booksfound = {};
  // for (let isbn of isbns) {
  //   if (books[isbn].author.toLowerCase() == author.toLowerCase()) booksfound[isbn] = books[isbn];
  // }
  // if (Object.keys(booksfound).length > 0) res.send(booksfound)
  // else res.send(`No book written by ${author} is found`)

  // using Promise
  getBooksByProperty(req.params.author, "author").then(data => res.send(data)).catch(err => res.send(err));
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  //Write your code here
  // let title = req.params.title;
  // let isbns = Object.keys(books);
  // let booksfound = {};
  // for (let isbn of isbns) {
  //   if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) booksfound[isbn] = books[isbn];
  // }
  // if (Object.keys(booksfound).length > 0) res.send(booksfound);
  // else res.send(`Cannot find book by title: ${title}`);

  // using Promise
  getBooksByProperty(req.params.title, "title").then(data => res.send(data)).catch(err => res.send(err));
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  //Write your code here
  // let book = books[req.params.isbn]
  // if (book) res.send(book.reviews)
  // else res.send(`No book found with ISBN ${req.params.isbn}`);

  // using Promise
  getBookReviews(req.params.isbn).then(data => res.send(data)).catch(err => res.send(err))
});

module.exports.general = public_users;
