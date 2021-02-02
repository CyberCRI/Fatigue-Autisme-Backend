const express = require('express')
const Renseignement = require('../models/Renseignement')
const auth = require('../middleware/auth')
const router = express.Router()
const ObjectId = require('mongoose').Types.ObjectId;

router.get('/renseignement', auth, async(req, res) => {
    try {
        const renseignement = await Renseignement.findAll();
        res.status(200).send(renseignement)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/renseignement/:id', auth, async(req, res) => {
    try {
        const renseignement = await Renseignement.find({userId: new ObjectId(req.param('id'))});
        res.status(200).send(renseignement)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/renseignement/update/:id', auth, async(req, res) => {
    try {
        const data = { name: req.body.name, description: req.body.description, events: req.body.events}
        const renseignement = await Renseignement.findOneAndUpdate({_id: new ObjectId(req.param('id'))}, data);
        renseignement.save()
        console.log(renseignement)
        res.status(200).send(renseignement)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.put("/renseignement", auth,  async (req, res) => {
    // Create a new fiche renseignements
    try {
        const renseignement = new Renseignement()
        renseignement.content = req.body.content
        renseignement.userId = req.body.userId
        await renseignement.save()
        res.status(201).send(renseignement)
    } catch (err) {
        if (err) {
            console.log(err)
            if (err.name === 'MongoError' && err.code === 11000) {
                return res.status(400).send({ failed: 'Cannot create renseignement!' });
            }
            return res.status(400).send({ failed: 'Cannot create renseignement!' });
        }
        res.status(400).send({ failed: 'Cannot create renseignement' })
    }
});

module.exports = router