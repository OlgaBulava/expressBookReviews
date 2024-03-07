const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let getBooksArray = new Promise((resolve,reject) => {
  setTimeout(() => {
    resolve(books);
  }, 2000)})

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      return res.status(404).json({message: "User already exists!"});
    } else {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books));
  return res.status(200).json({message: "Books list"});
});

public_users.get('/isbn/:isbn',function (req, res) {
  const isbnName = req.params.isbn;

  getBooksArray.then(result => {
    function getValueByKey(object, row) {
      return object[row];
    }
    const bookByIsbn = getValueByKey(result, isbnName);
    res.send(bookByIsbn);
  });
});


public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;
  getBooksArray.then(result => {
    const booksArray = Object.keys(result).map(key => result[key]);
    let filtered_books = booksArray.filter((books) => books.author === authorName);
    res.send(filtered_books);
  });

});

public_users.get('/title/:title',function (req, res) {
  const titleName = req.params.title;
  getBooksArray.then(result => {
    const booksArray = Object.keys(result).map(key => result[key]);
    let filtered_books = booksArray.filter((books) => books.title === titleName);
    res.send(filtered_books);
  });
});


public_users.get('/review/:isbn',function (req, res) {
  const isbnName = req.params.isbn;
  getBooksArray.then(result => {
    function getValueByKey(object, row) {
      return object[row];
    }
    const bookByIsbn = getValueByKey(result, isbnName).reviews;
    res.send(bookByIsbn);
  });
});

module.exports.general = public_users;
