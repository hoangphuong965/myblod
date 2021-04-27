const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const normal = require("normalize-url");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const _ = require("lodash");
const config = require("config");
const axios = require("axios");

// @route GET api/profile/me
// @desc  Get current users profile
// @access Private
router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res
                .status(400)
                .json({ msg: "there is no profile for this user" });
        }
        res.json(profile.populate("user", ["name", "avatar"]));
    } catch (error) {
        console.error(error.message);
        return res.status(500).json("Server Error");
    }
});

// @route POST api/profile
// @desc  Create or Update user profile
// @access Private
router.post(
    "/",
    [
        auth,
        [
            check("status", "status is required").not().isEmpty(),
            check("skills", "skills is required").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // destructure the request
        const {
            website,
            skills,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
            // spread the rest of the fields we don't need to check
            ...rest // bio, github, location
        } = req.body;

        // Build profile object
        const profileFields = {
            user: req.user.id,
            website:
                website && website != ""
                    ? normal(website, { forceHttps: true })
                    : "",
            skills: Array.isArray(skills)
                ? skills
                : skills.split(",").map((skill) => skill.trim()),
            ...rest,
        };
        // Build social object
        const socialFields = {
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
        };

        profileFields.social = socialFields;

        try {
            let profile = await Profile.findOne({ user: req.user.id });

            // update
            if (profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );
                return res.json(profile);
            }

            // Create
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
        } catch (error) {
            console.error(error.message);
            return res.status(500).json("Server Error");
        }
    }
);

// @route POST api/profile
// @desc  Get all profiles
// @access Public
router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find({}).populate("user", [
            "name",
            "avatar",
        ]);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json("Server Error");
    }
});

// @route POST api/profile/:userId
// @desc  Get profiles by user id
// @access public
router.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id,
        }).populate("user", ["name", "avatar"]);

        if (!profile) {
            return res.status(400).json({ msg: "profile not found" });
        }
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == "ObjectId") {
            return res.status(400).json({ msg: "profile not found" });
        }
        return res.status(500).json("Server Error");
    }
});

// @route DELETE api/profile/:post_id
// @desc  Delete profile, user & posts
// @access Private
router.delete("/", auth, async (req, res) => {
    try {
        // @todo - remove users posts

        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: "User deleted" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json("Server Error");
    }
});

// @route PUT api/profile/experience
// @desc  Add profile experience
// @access Private
router.put(
    "/experience",
    [
        auth,
        [
            check("title", "title is required").notEmpty(),
            check("company", "company is required").notEmpty(),
            check("from", "from data is required").notEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.experience.unshift(newExp);
            await profile.save();
            res.json(profile);
        } catch (error) {
            console.error(error.message);
            return res.status(500).json("Server Error");
        }
    }
);

// @route DELETE api/profile/experience/:exp_id
// @desc  Deltete profile experience
// @access Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience = profile.experience.filter(
            (exp) => exp._id.toString() !== req.params.exp_id
        );
        await profile.save();
        return res.json(profile);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json("Server Error");
    }
});

// @route PUT api/profile/education
// @desc  Add profile education
// @access Private
router.put(
    "/education",
    [
        auth,
        [
            check("school", "School is required").notEmpty(),
            check("degree", "Degree is required").notEmpty(),
            check("fieldofstudy", "Field of study is required").notEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.education.unshift(newEdu);
            await profile.save();
            return res.json(profile);
        } catch (error) {
            console.error(error.message);
            return res.status(500).json("Server Error");
        }
    }
);

// @route DELETE api/profile/education/:edu_id
// @desc  Delete profile education
// @access Private
router.delete("/education/:edu_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education = profile.education.filter(
            (edu) => edu._id.toString() !== req.params.edu_id
        );
        await profile.save();
        return res.json(profile);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json("Server Error");
    }
});

// @route POST api/profile/education/:edu_id
// @desc  Update profile education
// @access Private
router.post("/education/:edu_id", auth, async (req, res) => {
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
    } = req.body;

    const updateEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
    };
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education = _.extend(updateEdu);
        await profile.save();
        return res.json(profile);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json("Server Error");
    }
});

// @route POST api/profile/experience/:exp_id
// @desc  Update profile experience
// @access Private
router.post("/experience/:exp_id", auth, async (req, res) => {
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
    } = req.body;

    const updateExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
    };
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience = _.extend(updateExp);
        await profile.save();
        return res.json(profile);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json("Server Error");
    }
});

module.exports = router;
