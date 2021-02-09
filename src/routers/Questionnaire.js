const express = require('express')
const Questionnaire = require('../models/Questionnaire')
const auth = require('../middleware/auth')
const router = express.Router()
const ObjectId = require('mongoose').Types.ObjectId;

router.get('/questionnaire', auth, async(req, res) => {
    try {
        const questionnaire = await Questionnaire.findAll();
        res.status(200).send(questionnaire)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/questionnaire/:id', auth, async(req, res) => {
    try {
        const questionnaire = await Questionnaire.find({userId: new ObjectId(req.param('id'))});
        res.status(200).send(questionnaire)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/questionnaire', auth, async(req, res) => {
    try {
        let data= {};
        if(req.body.id===2) {
            data = { questionnaire2: req.body.content}
        }
        else if(req.body.id===3) {
            data = { questionnaire3: req.body.content}
        }
        else if(req.body.id===4) {
            data = { questionnaire4: req.body.content}
        }
        else if(req.body.id===5) {
            data = { questionnaire5: req.body.content}
        }
        else if(req.body.id===6) {
            data = { questionnaire6: req.body.content}
        }
        const questionnaire = await Questionnaire.findOneAndUpdate({userId: new ObjectId(req.body.userId)}, data);
        questionnaire.save()
        res.status(200).send(questionnaire)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.put("/questionnaire", auth,  async (req, res) => {
    // Create a new fiche questionnaire
    try {
        const questionnaire = new Questionnaire()
        questionnaire.questionnaire1 = req.body.content
        questionnaire.userId = req.body.userId
        await questionnaire.save()
        res.status(201).send(questionnaire)
    } catch (err) {
        if (err) {
            console.log(err)
            if (err.name === 'MongoError' && err.code === 11000) {
                return res.status(400).send({ failed: 'Cannot create questionnaire!' });
            }
            return res.status(400).send({ failed: 'Cannot create questionnaire!' });
        }
        res.status(400).send({ failed: 'Cannot create questionnaire' })
    }
});

router.put("/childQuestionnaire", auth, async (req, res) => {
    console.log(`\n>>put /childQuestionnaire:`);
    console.log(`>>body:`);
    console.log(req.body);

    const userId = req.body.userId
    const content = req.body.content

    Questionnaire.findOneAndUpdate({ userId: userId }, {userId: userId, child: content}, { upsert: true}, function(err) {
        if (err) {
            console.log(err)
            if (err.name === 'MongoError' && err.code === 11000) {
                return res.status(400).send({ failed: 'Cannot create questionnaire!' });
            }
            return res.status(400).send({ failed: 'Cannot create questionnaire!' });
        }
        return res.status(201).send({ message: "Questionnaire enfant sauvé."});
    });
})

module.exports = router