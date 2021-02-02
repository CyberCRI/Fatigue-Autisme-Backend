const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')
const router = express.Router()
const passwordHelper = require('../helper/passwordHelper')
const emailHelper = require('../helper/emailHelper')
const ObjectId = require('mongoose').Types.ObjectId;

router.put('/users', async (req, res) => {
    // Create a new user
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        //emailHelper.verifyEmail(req.body.email, req.body.firstName, token)
        //res.status(201).send({ user, token })
        res.status(201).send(true)
    } catch (err) {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                return res.status(422).send({ failed: 'User already exist!' });
            }
            console.log(err)
            return res.status(422).send({ failed: 'Account creation failed' });
        }
        res.status(400).send({ failed: 'Account creation failed' })
    }
})

router.patch('/users', auth, async(req, res) => {
    try {
        const user = await User.findOneAndUpdate({_id: new ObjectId(req.param('id'))}, req.body);
        console.log(user)
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/login', async(req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send('Identifiants invalides')
        }
        if (user.status === 'Pending'){
            return res.status(401).send('Email non vérifié')
        }
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(401).send('Identifiants invalides')
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
        console.log(user)
        res.status(200).send('deconnection')
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.put('/users/create', auth, async (req, res) => {
    console.log(req.account)
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
        console.log(user)
        res.status(200).send(user)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

module.exports = router