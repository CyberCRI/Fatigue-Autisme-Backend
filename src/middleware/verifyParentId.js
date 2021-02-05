const User = require('../models/User');

module.exports = (req, res, next) => {
    const isParent = !req.body.isChild;
    if (isParent) {
        next();
    } else {
        User.findOne({ parentId: req.body.parentId, isParent: true }, (err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (!user) {
                res.status(400).send({ message: "Identifiant du parent non reconnu." });
                return;
            }
            next();
        });
    }
};