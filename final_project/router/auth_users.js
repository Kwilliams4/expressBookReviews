const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Check if the username exists in the users array
    return users.some((user) => user.username === username);
  };

const authenticateUser = (username, password) => {
    // Check if the username and password match the records
    return users.some((user) => user.username === username && user.password === password);
  };

  regd_users.get("/users", function (req, res) {
    //Write your code here
    return res.send(JSON.stringify({"Lolo":"dori"}));
  });

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Check if the username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username and password match
    if (authenticateUser(username, password)) {

      // Set the username in req.user
      req.user = { username: username };
      // Generate a JWT token
      const token = jwt.sign({ username }, "access");

      // Set the authorization information in the session
      req.session.authorization = {
        accessToken: token
      };
      return res.status(200).json({ message: "Login successful" , token});
    }
  
    return res.status(401).json({ message: "Invalid username or password" });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username; // Assuming the username is stored in the req.user object after authentication
  
  var booksObj = Object.keys(books);
  var book;

  for(var i = 1; i <= booksObj.length; i++){  
    if (books[i].isbn == isbn) {
        book = books[i];
      break;
    }
}
    if(!book) {
        return res.status(400).json({ message: "No Book Found!" });
         }

         const userReviews = book.reviews.filter((review) => review.username === username); // HASTA AQUI FUNCIONA
    
    if (!book.reviews) {
      book.reviews = [];
      // Add new review
      const newReview = {
        username: username,
        review: review,
      };
      book.reviews.push(newReview);
      return res.status(200).json({ message: "Review added successfully" });
    }

  else{
      if(!userReviews){
          
         // Add new review
        const newReview = {
          username: username,
          review: review,
        };
        book.reviews.push(newReview);
        return res.status(200).json({ message: "Review added successfully" });
      }

      else{
            var numberOfExistingReviews=book.reviews.length;

             const newReview = {
                 username: username,
                 review: review
                }; 

        book.reviews[numberOfExistingReviews-1]=newReview;      //array
        book.review[userReviews] = newReview.review;
        
     return res.status(200).json({ message: "Review modified successfully" });
    } 
}
  });


  // Delete a book review
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username; // Assuming the username is stored in the req.user object after authentication

    if (!books.hasOwnProperty(isbn)) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews || books[isbn].reviews.length === 0) {
        return res.status(404).json({ message: "No reviews found for this book" });
    }

    const filteredReviews = books[isbn].reviews.filter((review) => review.username === username);

    if (filteredReviews.length === 0) {
        return res.status(404).json({ message: "No reviews found for the logged-in user" });
    }

    // Remove the filtered reviews
    filteredReviews.forEach((review) => {
        const reviewIndex = books[isbn].reviews.indexOf(review);
        books[isbn].reviews.splice(reviewIndex, 1);
    });

    return res.status(200).json({ message: "Reviews deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
