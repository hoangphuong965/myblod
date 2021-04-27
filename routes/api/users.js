const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const { check, validationResult } = require("express-validator");

// @route POST api/user
// @desc Test route
// @access Public
router.post(
    "/",
    [
        check("name", "name is required").not().isEmpty(),
        check("email", "please include a valid email").isEmail(),
        check("password", "password must be a 6 or more characters").isLength({
            min: 6,
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;
        // see if user exists
        try {
            let user = await User.findOne({ email });
            if (user) {
                res.status(400).json({
                    errors: [{ msg: "User already exists" }],
                });
            }
            // get users gravatar
            const avatar = gravatar.url(email, {
                s: "200",
                r: "pg",
                d: "mm",
            });
            user = new User({ name, email, avatar, password });
            // encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            // return jsonwebtoken
            const payload = {
                user: { id: user.id },
            };

            jwt.sign(
                payload,
                config.get("jwtSecret"),
                { expiresIn: 36000 },
                (err, token) => {
                    if (err) throw err;
                    return res.json({ token });
                }
            );
        } catch (error) {
            console.error(error.message);
            return res.status(500).send("Server error");
        }
    }
);

module.exports = router;
