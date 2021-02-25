const express = require('express')
const router = express.Router()
const verifyAdmin = require('../middleware/verifyAdmin');
var { Parser } = require('json2csv')
var flatten = require('flat');
const Questionnaire = require('../models/Questionnaire');
const Comment = require('../models/Comment');
const Renseignement = require('../models/Renseignement');
const { use } = require('./Questionnaire');



router.get('/dataAdmin/:password', [verifyAdmin], async (req, res) => {
    console.log('\n>>GET dataAdmin');
    let ret = []
    try {
        Questionnaire.find().populate('userId')
            .exec(function (err, answers) {
                answers.forEach(answer => {
                    try {
                        let data = {
                            email: answer.userId.email,
                            userId: answer.userId._id,
                            parentId: answer.userId.parentId,
                            isParent: answer.userId.isParent
                        }
                        let userAnswers = {}
                        if (answer.child) {
                            userAnswers = answer.child
                        } else {
                            const parentAnswers1 = answer.questionnaire1 || []
                            const parentAnswers2 = answer.questionnaire2 || []
                            const parentAnswers3 = answer.questionnaire3 || []
                            const parentAnswers4 = answer.questionnaire4 || []
                            const parentAnswers5 = answer.questionnaire5 || []
                            const parentAnswers6 = answer.questionnaire6 || []
                            userAnswers = Object.assign(userAnswers, parentAnswers1)
                            userAnswers = Object.assign(userAnswers, parentAnswers2)
                            userAnswers = Object.assign(userAnswers, parentAnswers3)
                            userAnswers = Object.assign(userAnswers, parentAnswers4)
                            userAnswers = Object.assign(userAnswers, parentAnswers5)
                            userAnswers = Object.assign(userAnswers, parentAnswers6)
                        }
                        data = Object.assign(data, flatten(userAnswers))
                        ret.push(data)
                    } catch (error) {
                        console.log('error:', error.message);
                    }
                });
                const parser = new Parser();
                const csv = parser.parse(ret);
                res.attachment('answers.csv')
                res.status(200).send(csv)
            });
    } catch (error) {
        console.log('error:', error.message);
        res.status(500).send(error.message)
    }
})


router.get('/dataAdminComments/:password', [verifyAdmin], async (req, res) => {
    console.log('\n>>GET dataAdminComments');
    let ret = []
    try {
        Comment.find().populate('userId')
            .exec(function (err, comments) {
                comments.forEach(comment => {
                    try {
                        let data = {
                            email: comment.userId.email,
                            userId: comment.userId._id,
                            parentId: comment.userId.parentId,
                            isParent: comment.userId.isParent,
                            comment: comment.text,
                            date: comment.createdAt
                        }
                        ret.push(data)
                    } catch (error) {
                        console.log('error:', error.message);
                    }
                });
                const parser = new Parser();
                const csv = parser.parse(ret);
                res.attachment('comments.csv')
                res.status(200).send(csv)
            });
    } catch (error) {
        console.log('error:', error.message);
        res.status(500).send(error.message)
    }
})


router.get('/dataAdminRenseignements/:password', [verifyAdmin], async (req, res) => {
    console.log('\n>>GET dataAdminRenseignements');
    let ret = []
    try {
        Renseignement.find().populate('userId')
            .exec(function (err, renseignements) {
                renseignements.forEach(renseignement => {
                    try {
                        let data = {
                            email: renseignement.userId.email,
                            userId: renseignement.userId._id,
                            parentId: renseignement.userId.parentId,
                            isParent: renseignement.userId.isParent
                        }
                        let userAnswers = {}
                        userAnswers = renseignement.content
                        data = Object.assign(data, flatten(userAnswers))
                        ret.push(data)
                    } catch (error) {
                        console.log('error:', error.message);
                    }
                });
                const parser = new Parser();
                const csv = parser.parse(ret);
                res.attachment('fiche_renseignements.csv')
                res.status(200).send(csv)
            });
    } catch (error) {
        console.log('error:', error.message);
        res.status(500).send(error.message)
    }
})

module.exports = router