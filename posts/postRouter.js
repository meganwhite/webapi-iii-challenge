const express = require('express');
const postDb = require('./postDb');

const router = express.Router();

router.get('/', (req, res) => {
    postDb
    .get()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({message: "could not retrieve posts"})
    })
});

router.get('/:id', validatePostId, (req, res) => {
    res.status(200).json(req.post)
});

router.delete('/:id', validatePostId, (req, res) => {
    const {id} = req.params;

    postDb
    .remove(id)
    .then(response => {
        if (response) {
            res.status(200).json({message: "post successfully deleted"})
        }
        else {
            res.status(400).json({message: "no posts were deleted"})
        }
    })
    .catch((error) => {
        console.log(error)
        res.status(500).json({message: "post could not be deleted"})
    })

});

router.put('/:id', validatePostId, validatePost, (req, res) => {
    const {id} = req.params
    const updatedPost = req.body

    postDb
    .update(id,updatedPost)
    .then(response => {
        if (response) {
            res.status(200).json({message: "post was updated"})
        }
        else {
            res.status(400).json({message: "post could not be updated"})
        }
    })
    .catch((error) => {
        console.log(error)
        res.status(500).json({message: "post could not be updated by server"})
    })

});

// custom middleware

function validatePostId(req, res, next) {
    const {id} = req.params;

    postDb
    .getById(id)
    .then(post => {
        console.log("post on post middlware", post);
        if(post) {
            req.post = post
            next()
        }
        else {
            return res.status(404).json({message: "invalid post ID"})
        }
    })
    .catch((error) => {
        console.log(error)
        res.status(500).json({message: "could not get post"})
    })
};

function validatePost(req, res, next) {
    const {text} = req.body;
    const {bodyContent} = Object.keys(req.body);
    console.log("body", req.body)

    if(bodyContent.length === 0) {
        return res.status(400).json({message: "missing post data"})
    }
    if(!text) {
        return res.status(400).json({message: "missing required text field"})
    }
    next();
};

module.exports = router;