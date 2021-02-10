const express = require('express')
const Comment = require('../models/Comment')
const auth = require('../middleware/auth')
const router = express.Router()
const ObjectId = require('mongoose').Types.ObjectId;

router.put("/comment", auth, async (req, res) => {
    console.log(`\n>>put /comment:`);
    console.log(`>>body:`);
    console.log(req.body);
    try {
        const comment = new Comment()
        comment.userId = req.body.userId
        comment.text = req.body.comment
        await comment.save()
        res.status(201).send(comment)
    } catch (err) {
        if (err) {
            console.log(err)
            if (err.name === 'MongoError' && err.code === 11000) {
                return res.status(400).send({ failed: 'Cannot create comment!' });
            }
            return res.status(400).send({ failed: 'Cannot create comment!' });
        }
        res.status(400).send({ failed: 'Cannot create comment' })
    }
});

module.exports = router;