const express = require('express')
const User = require('../models/User')
const Questionnaire = require('../models/Questionnaire')
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')
const router = express.Router()
const passwordHelper = require('../helper/passwordHelper')
const emailHelper = require('../helper/emailHelper')
const ObjectId = require('mongoose').Types.ObjectId;
const verifyParentId = require('../middleware/verifyParentId');

router.put('/users',[verifyParentId], async (req, res) => {

    const isParent = !req.body.isChild;
    let parentId = req.body.parentId;
    if (!isParent && parentId === '') {
        return res.status(404).send({ message: "Identifiant du parent non renseigné." });
    }

    if (isParent) {
        parentId = '';
    }

    const user = new User({
        email: req.body.email,
        isParent: isParent,
        parentId: parentId,
        password: req.body.password
    });

    user.save((err, user) => {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                return res.status(422).send({ message: 'Cet email est déjà utilisé.' });
            }
            res.status(500).send({message: err});
            return;
        }

        user.generateAuthToken();
        res.status(201).send(true);
    })
})

router.patch('/users', auth, async(req, res) => {
    try {
        const user = await User.findOneAndUpdate({_id: new ObjectId(req.param('id'))}, req.body);
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/login', async(req, res) => {
    console.log(`\n>>post users/login:`);
    console.log(`>>req.body:`);
    console.log(req.body);
    //Login a registered user
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({ message:'Identifiants invalides.' })
        }
        if (user.status === 'Pending'){
            return res.status(401).send({ message: 'Email non vérifié.' });
        }
        console.log(`>>Found user id:` + user._id);
        const token = await user.generateAuthToken()
        const questionnaire = await Questionnaire.findByUser(user._id);
        console.log(`>>questionnaire:` + questionnaire);

        res.send({ user, token, questionnaire })
    } catch (error) {
        console.log(`>>Identifiants invalides`);
        res.status(401).send({ message: `Identifiants invalides.` })
    }
})

router.get('/users/me', auth, async(req, res) => {
    // View logged in user profile
    res.send(req.user)
})


router.patch('/users/logout', auth, async (req, res) => {
    // Log user out of the application
    try {
        const user = await User.findOneAndUpdate({_id: new ObjectId(req.param('id'))}, {tokens: []});
        res.status(200).send('deconnection')
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.put('/users/create', auth, async (req, res) => {
    // Create a sub account
    try {
        password = passwordHelper.generatePassword(10)
        const user = new User()
        user.email = req.body.email
        user.password = password
        await user.save()
        const token = await user.generateAuthToken()

        emailHelper.verifyEmail(req.body.email, token, password)

        res.status(201).send({ user, token })
    } catch (err) {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                return res.status(422).send({ failed: 'User already exist!' });
            }
            return res.status(422).send({ failed: 'Account creation failed' });
        }
        res.status(400).send({ failed: 'Account creation failed' })
    }
})


router.get('/users/verifyemail/:token', async(req, res) => {
    try {
        const user = await User.findOne({'tokens.token': req.params.token});
        user.status = "Active"
        user.save()
        res.status(200).send(true)
    } catch (error) {
        res.status(403).send(false)
    }
})

router.post('/users/password/forgot', async(req, res) => {
    try {
        const user = await User.findOne({'email': req.body.email});
        emailHelper.passwordForgot(req.body.email, user.firstName, user.tokens[user.tokens.length-1].token)
        res.status(200).send('Instructions sent to your email address')
    } catch (error) {
        res.status(403).send(false)
    }
})

router.post('/users/password/reset', async(req, res) => {
    try {
        const user = await User.findOne({'tokens.token': req.body.token});
        user.password = req.body.password
        await user.save()
        res.status(200).send('Password changed successfully')
    } catch (error) {
        res.status(403).send(error)
    }
})

router.get('/users/:id', auth, async(req, res) => {
    try {
        const user = await User.findOne({_id: new ObjectId(req.param('id'))});
        res.status(200).send(user)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

module.exports = router