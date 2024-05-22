const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  if (users.map(x => x.username).includes(username)) return false
  return true
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  for (let user of users) {
    if (user.username === username && user.password === password) return true
  }
  return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) return res.status(404).json({message:"Error logging in, please check username and password!"});

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, "access", {expiresIn: 60 * 60})

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  }
  else return res.status(208).json({message:"Invalid Login. Check username and password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let username = req.session.authorization.username;
  let book = books[req.params.isbn];
  if (!book) return res.send(`Cannot find book with ISBN: ${req.params.isbn}`);
  book.reviews[username] = req.query.review
  return res.send("Successfully posted review");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization.username;
  let book = books[req.params.isbn];
  if (!book) return res.send(`Cannot find book with ISBN: ${req.params.isbn}`);
  if (book.reviews[username]) delete book.reviews[username];
  else return res.send(`You don't have a review for this book`);
  if (!book.reviews[username]) return res.send("Your review has successfully been deleted");
  else return res.status(500).json({message:"Error deleting review"})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
