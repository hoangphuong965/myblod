const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Post = require("../../models/Post");
const User = require("../../models/User");

// @route POST api/post
// @desc Create a post
// @access Private
router.post(
    "/",
    [auth, [check("text", "text is required").notEmpty()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select("-password");
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            });
            const post = await newPost.save();
            return res.json(post);
        } catch (error) {
            console.log(error.message);
            return res.status(500).send("Server Error");
        }
    }
);

// @route GET api/post
// @desc Get all a post
// @access Public
router.get("/", auth, async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ data: -1 });
        return res.json(posts);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server Error");
    }
});

// @route GET api/post/:id
// @desc Get post by Id
// @access Private
router.get("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: "post not found" });
        }
        return res.json(post);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server Error");
    }
});

// @route DELETE api/post
// @desc Delete a post
// @access Private
router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // check user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" });
        }
        await post.remove();
        return res.json({ msg: "Post removed" });
    } catch (error) {
        console.log(error.message);
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "post not found" });
        }
        return res.status(500).send("Server Error");
    }
});

// @route PUT api/post/like/:id
// @desc Like a post
// @access Private
router.put("/like/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // check if the post has already been liked
        if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
                .length > 0
        ) {
            return res.status(400).json({ msg: "post already liked" });
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();
        return res.json(post.likes);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server Error");
    }
});

// @route PUT api/post/unlike/:id
// @desc unLike a post
// @access Private
router.put("/unlike/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // check if the post has already been unliked
        if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
                .length === 0
        ) {
            return res.status(400).json({ msg: "Post has not yet been liked" });
        }
        // remove like
        post.likes = post.likes.filter(
            (like) => like.user.toString() !== req.user.id
        );
        await post.save();
        return res.json(post.likes);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server Error");
    }
});

// @route POST api/post/comment/:id
// @desc Create a comment
// @access Private
router.post(
    "/comment/:id",
    [auth, [check("text", "comment is required").notEmpty()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select("-password");
            const post = await Post.findById(req.params.id);
            const newComment = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            });
            post.comments.unshift(newComment);
            await post.save();
            return res.json(post.comments);
        } catch (error) {
            console.log(error.message);
            return res.status(500).send("Server Error");
        }
    }
);

// @route DELETE api/post/comment/:id/:comment_id
// @desc Delete a comment
// @access Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // get info comment
        const comment = post.comments.find(
            (cmt) => cmt.id === req.params.comment_id
        );

        // Check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" });
        }

        post.comments = post.comments.filter(
            (cmt) => cmt.id !== req.params.comment_id
        );

        await post.save();
        return res.json(post.comments);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server Error");
    }
});

// @route POST api/post/comment/:id/:comment_id
// @desc Update a comment
// @access Private

module.exports = router;
