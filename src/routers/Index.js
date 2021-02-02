const express = require('express')
const router = express.Router()

router.get('/', async(req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.send('Fatigue Autisme API')
})

module.exports = router