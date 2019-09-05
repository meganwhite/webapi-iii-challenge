const express = require('express');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
    const newUser = req.body;
    userDb
    .insert(newUser)
    .then((response) => {
        res.status(201).json(response)
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({message: "new user could not be created"})
    })
});

router.post('/:id/posts', validateUserId, validateUser, (req, res) => {
    const {id} = req.params;
    let post = req.body;
    post.user_id = id;
    console.log("post", post);

    postDb
    .insert(post)
    .then((response) => {
        console.log(response)
        res.status(201).json(response)
    })
    .catch((error) => {
        console.log(error)
        res.status(500).json({message: "Post could not be added"})
    })

});

router.get('/', (req, res) => {
    userDb
    .get()
    .then(users => res.status(200).json(users))
    .catch((error) => {
        console.log(error)
        res.status(500).json({error: "could not retrieve users from the database"})
    })

});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
    const {id} = req.params;
    userDb
    .getUserPosts(id)
    .then(posts => {
        console.log(posts)
        res.status(200).json(posts)
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({error: "could not retrieve posts for the user"})
    })

});

router.delete('/:id', validateUserId, (req, res) => {
    const {id} = req.params;

    userDb
    .remove(id)
    .then((response) => {
        if (response) {
            res.status(200).json({message: "user deleted"})
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({message: "user could not be deleted"})
    })

});

router.put('/:id', validateUser, (req, res) => {
    const {id} = req.params;
    const updatedUser = req.body;

    userDb
    .update(id, updatedUser)
    .then((response) => {
        if (response) {
            return res.status(200).json({message: "user updated"})
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({message: "user could not be updated"})
    })

});

//custom middleware

function validateUser(req, res, next) {
    console.log(req.body)
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({message: "missing user data"})
    }
    else {
      next()
    }
};

function validateUserId(req, res, next) {

};

function validatePost(req, res, next) {

};

module.exports = router;
