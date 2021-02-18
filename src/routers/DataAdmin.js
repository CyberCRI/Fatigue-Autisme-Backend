const express = require('express')
const router = express.Router()
const verifyAdmin = require('../middleware/verifyAdmin');
var { Parser } = require('json2csv')
var flatten = require('flat');
const Questionnaire = require('../models/Questionnaire');
const { use } = require('./Questionnaire');



router.get('/dataAdmin/:password', [verifyAdmin], async (req, res) => {
    console.log('\n>>GET dataAdmin');
    let ret = []
    try {
        Questionnaire.find().populate('userId')
            .exec(function (err, answers) {
                answers.forEach(answer => {
                    let data = {
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
                });
                const parser = new Parser();
                const csv = parser.parse(ret);
                res.attachment('data.csv')
                res.status(200).send(csv)
            });
    } catch (error) {
        console.log('error:', error.message);
        res.status(500).send(error.message)
    }
})

module.exports = router