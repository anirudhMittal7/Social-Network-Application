const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Post Model
const Post = require('../../models/Post');
//Profile Model
const Profile = require('../../models/Profile');


//Validation
const validatePostInput = require('../../validation/post');

router.get("/test", (req, res) => res.json({ msg: "posts works" }));

// @route POST api/posts
//@desc create post
//@access Private


router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });
    newPost.save().then(post => res.json(post));
})


// @route GET api/posts
//@desc get posts
//@access Public

router.get('/', (req, res) => {

    Post.find().sort({ date: -1 })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json(err));

});


// @route GET api/posts/:id
//@desc get post by Id
//@access Public
router.get('/:id', (req, res) => {

    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json(err));

});

//@route DELETE api/posts/:id
//@desc delete the post
//@access Private

router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //check for post owner
                    if (post.user.toString() != req.user.id) {
                        return res.status(401).json({ notAuthorized: 'User Not Authorized' });
                    }

                    post.remove()
                        .then(() => res.json({ success: true }))
                        .catch(err => res.status(404).json({ postNotFound: 'Post not found' }));
                })
        })
});

//@route POST api/posts/like/:id
//@desc like the post
//@access Private

router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //need to check if the post has already been liked by the user
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({ alreadyLiked: 'User already liked this post' });
                    }

                    //add the user id to the likes array
                    post.likes.unshift({ user: req.user.id });

                    //now save the post

                    post.save()
                        .then(post => res.json(post))

                })
        })
});

//@route POST api/posts/unlike/:id
//@desc unlike the post
//@access Private

router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //need to check if the post has already been liked by the user
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length == 0) {
                        return res.status(400).json({ notLiked: 'User has not liked this post' });
                    }

                    const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);

                    //splice it out of array
                    post.likes.splice(removeIndex, 1);

                    //save the post
                    post.save().then(post => res.json(post))


                })
        })
});

//@route POST api/posts/comment/:id
//@desc add comment to post
//@access Private

router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            };

            //add to comments array
            post.comments.unshift(newComment);

            post.save().then(post => res.json(post)).catch(err => res.status(404).json({ postnotfound: 'No Post found' }));
        })
});

//@route DELETE api/posts/comment/:id/:comment_id
//@desc remove comment from post
//@access Private

router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {

    Post.findById(req.params.id)
        .then(post => {
            //check if the comment exists
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                //comment does not exist
                return res.status(404).json({ commentnotexists: 'The comment does not exist' });
            }
            //get remove index
            const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);
            //splice it out 
            post.comments.splice(removeIndex, 1);
            //save the post
            post.save().then(post => res.json(post)).catch(err => res.json(err));
        })
});




module.exports = router;
