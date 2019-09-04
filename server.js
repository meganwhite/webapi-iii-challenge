const express = require('express');

const server = express();

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

const userRouter = require('./users/userRouter')
const postRouter = require('./posts/postRouter')

server.use(express.json());
server.use(logger);
server.use('/users', userRouter);
server.use('posts', postRouter);

function logger(req, res, next) {
  console.log(`${new Date().toISOString()} There was a ${req.method} request made to ${req.url}`)
  next();
};

function validateUserID(req, res, next) {
  console.log(req.body)
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({message: "No user data"})
  }
  else {
    next()
  }
}

server.get('/', (req,res) => {
  res.status(200).json({api: 'up'});
})

module.exports = server;
