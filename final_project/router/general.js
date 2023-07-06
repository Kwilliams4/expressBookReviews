const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (isValid(username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    //registerUser(username, password);
    const authenticatedUser = {
       "username": username,
        "password": password
        // Additional user properties
      };
    
      // Attach the authenticated user to req.user
      users.push(authenticatedUser);
    
    
  
    return res.status(200).json({ message: "User registered successfully" });
  });
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
});

// Get books by ISBN
  public_users.get('/isbn/:ISBN',function (req, res) {
    const isbn = req.params.ISBN;
    const matchingBooks = [];
  
    const getMatchingBooks = new Promise((resolve, reject) => {
     
      Object.keys(books).forEach((key) => {
        const book = books[key];
        if (book.isbn == isbn) {
          matchingBooks.push(book);
        }
      });
  
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject({ message: "No books found for the author" });
      }
    });
  
    getMatchingBooks
      .then((books) => {
        res.send(books);
      })
      .catch((error) => {
        res.status(404).json(error);
      });
  });

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];
  
    const getMatchingBooks = new Promise((resolve, reject) => {
     
      Object.keys(books).forEach((key) => {
        const book = books[key];
        if (book.author === author) {
          matchingBooks.push(book);
        }
      });
  
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject({ message: "No books found for the author" });
      }
    });
  
    getMatchingBooks
      .then((books) => {
        res.send(books);
      })
      .catch((error) => {
        res.status(404).json(error);
      });
  });

// Get all books based on title
public_users.get('/title/:titulo',function (req, res) {     //(ruta)/:(path-parameter)
    const title = req.params.titulo;
    const matchingBooks = [];
  
    const getMatchingBooks = new Promise((resolve, reject) => {     //Promise method
      // Iterate through the books and check for matching title
      Object.keys(books).forEach((key) => {     // transforms to an array
        const book = books[key];            // book is an elment [] of books
        if (book.title === title) {
          matchingBooks.push(book);           // push title to array
        }
      });
  
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject({ message: "No books found with the given title" });
      }
    });
  
    getMatchingBooks            // Function call 
      .then((books) => {
        res.send(books);            // resolve (books) is reference to the value pushed
      })
      .catch((error) => {
        res.status(404).json(error);           // reject (error) is reference to message
      });
  });
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      const reviews = book.reviews;
      res.send(reviews);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
