// const User = require('../models/User');

module.exports = (req, res, next) => {
    console.log(">>Verify admin");
    console.log(">>req.params:")
    console.log(req.params)
    if (!req.params) {
        res.status(400).send({ message: "No params found." });
        return;
    }

    if (!req.params.password) {
        res.status(400).send({ message: "No password field found in params." });
        return;
    }
    const password = req.params.password;
    const validPassword = process.env.ADMIN_PWD;

    if (!validPassword) {
        res.status(400).send({ message: "No admin password set on server." });
        return;
    }

    if (validPassword === password) {
        next();
        return;
    }
    res.status(400).send({ message: "Invalid password." });
};