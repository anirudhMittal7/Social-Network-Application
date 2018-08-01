const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load validation

const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');



//load models
const Profile = require('../../models/Profile');
const User = require('../../models/User');



router.get("/test", (req, res) => res.json({ msg: "profile works" }));

// @route GET /api/profile/
// get current users profile
// @access Private
router.get("/", passport.authenticate('jwt', { session: false }), (req, res) => {

    const errors = {};
    Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = "There is no profile for this user";
                return res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => res.status(400).json(err));
});

//@route GET /api/profile/all
//@desc GET all profiles
//@access public

router.get('/all', (req, res) => {

    const errors = {};
    console.log('fetching all profiles route');
    
    Profile.find().populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errors.profile = "There are no profiles";
                return res.status(404).json(errros);
            }
            res.json(profiles);
        })
        .catch(err => res.status(400).json({ profile: "There are no profiles" }));
});

//@route GET /api/profile/handle/:handle
//Get profile by handle 
//@access Public

router.get('/handle/:handle', (req, res) => {

    const errors = {};
    Profile.findOne({ handle: req.params.handle }).populate('user', ['name', 'avatar'])
        .then(profile => {

            if (!profile) {
                errors.profile = "There is no profile for this user";
                res.status(404).json(errors);
            }
            res.json(profile);

        })
        .catch(err => res.status(404).json(err));

});

//@route GET /api/profile/user/:user_id
//Get profile by handle 
//@access Public

router.get('/user/:user_id', (req, res) => {

    const errors = {};
    Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
        .then(profile => {

            if (!profile) {
                errors.profile = "There is no profile for this user";
                res.status(404).json(errors);
            }
            res.json(profile);

        })
        .catch(err => res.status(404).json({ profile: 'There is no profile for this user' }));
});

// @route POST /api/profile/
// create and update user
// @access Private

router.post("/", passport.authenticate('jwt', { session: false }), (req, res) => {
    
    console.log(req.body);
    const { error, isValid } = validateProfileInput(req.body);

    //check validation
    console.log('isValid', isValid);
    console.log('error', error);
    if (!isValid) {
        //return the errors
        res.status(400).json(error);
    }

    const profileFields = {};
    const errors = {};
    profileFields.user = req.user.id;

    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    //skills - split into array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(",");
    }

    //Social

    console.log(req.body);

    profileFields.social = {youtube: "", facebook: "", linkedin: "", twitter: "", instagram: ""};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (profile) {
                //update if profile exists
                console.log('profile update begin');
                console.log(req.user);
                Profile.findOneAndUpdate({ user: req.user._id }, { $set: profileFields }, { new: true })
                 .then(profile =>{
                        console.log('profile', profile);
                         res.json(profile)
                    }
                 )
                    .catch(err => {
                        console.log('ERROR', err);
                        res.json(err)
                    });
            } else {
                //create profile

                //check of handle exists
                Profile.findOne({ handle: profileFields.handle })
                .then(profile => {
                    if (profile) {
                        errors.handle = 'That handle already exists';
                        res.status(400).json(errors);
                    }
                    //save profile
                    new Profile(profileFields).save()
                        .then(profile => res.json(profile))
                        .catch(error => console.log('error', error));
                })
                .catch(error => {console.log('error', error)});

            }
        })
        .catch(error => console.log(error));
})

//@route POST api/profile/experience
//@desc add experience to profile
//@access Private

router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {

    console.log(req.body);

    Profile.findOne({ user: req.user._id })
        .then(profile => {
            const { errors, isValid } = validateExperienceInput(req.body);
            console.log('isValid add expereince', isValid);
            console.log('error add experience', errors);
            if (!isValid) {
                res.status(400).json(errors);
            }

            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
            //add to experience array
            profile.experience.unshift(newExp);
            profile.save()
                .then(profile => res.json(profile));
        })

});

//@route POST api/profile/education
//@desc add education to profile
//@access Private

router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {

    Profile.findOne({ user: req.user.id })
        .then(profile => {

            console.log(req.body);
            const { errors, isValid } = validateEducationInput(req.body);

            console.log('Error add education', errors);
            console.log('IsValid add education', isValid);

            if (!isValid) {
                res.status(400).json(errors);
            }

            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
            //add to experience array
            profile.education.unshift(newEdu);
            profile.save()
                .then(profile => res.json(profile));
        })

});

//@route DELETE api/profile/experience/:exp_id
//@desc delete experience from profile
//@access Private


router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            //get remove index
            const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
            //splice out of array
            profile.experience.splice(removeIndex, 1);

            profile.save()
                .then(profile => res.json(profile))
                .catch(err => res.status(404).json(err));

        })

});

//@route DELETE api/profile/education/:exp_id
//@desc delete education from profile
//@access Private


router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            //get remove index
            const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
            //splice out of array
            profile.education.splice(removeIndex, 1);

            profile.save()
                .then(profile => res.json(profile))
                .catch(err => res.status(404).json(err));

        })

});

//@route DELETE api/profile
//@desc delete user and profile
//@access Private

router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {

    Profile.findOneAndRemove({ user: req.user.id })
        .then(() => {
            User.findOneAndRemove({ _id: req.user.id })
                .then(() => res.json({ success: true }));
        })
});





module.exports = router;
