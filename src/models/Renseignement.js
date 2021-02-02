const mongoose = require('mongoose')

const renseignementSchema = mongoose.Schema({
        content: {
            type: Object,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        }
    })

const Renseignement = mongoose.model('Renseignement', renseignementSchema)

module.exports = Renseignement