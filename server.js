const express = require('express');

const server = express();

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

const userRouter = require('./users/userRouter')
const postRouter = require('./posts/postRouter')



function logger(req, res, next) {
  console.log(req.body);
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

server.use(express.json());
server.use('/users', logger, userRouter);
server.use('posts', logger, postRouter);

server.get('/', (req,res) => {
  res.status(200).json({api: 'up'});
})

module.exports = server;
