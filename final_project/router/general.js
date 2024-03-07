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
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    }
  }
  return res.status(404).json({message: "Unable to register customer."});
});

public_users.get('/',function (req, res) {
  getBooksArray.then(result => {
    res.send({Books: result});
  });
});

public_users.get('/isbn/:isbn',function (req, res) {
  const isbnName = req.params.isbn;

  getBooksArray.then(result => {
    function getValueByKey(object, row) {
      return object[row];
    }
    const bookByIsbn = getValueByKey(result, isbnName);
    res.send({Booksbyisbn: bookByIsbn});
  });
});


public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;
  console.log(2332, authorName);
  getBooksArray.then(result => {
    const filteredBooks = Object.keys(result).map(key => result[key]).filter(book => book.author === authorName);

    res.send({BooksByAuthor: filteredBooks});
  });

});

public_users.get('/title/:title',function (req, res) {
  const titleName = req.params.title;
  getBooksArray.then(result => {
    const filteredBooks = Object.keys(result).map(key => result[key]).filter(book => book.title === titleName);
    res.send({BooksByTitle: filteredBooks});
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
