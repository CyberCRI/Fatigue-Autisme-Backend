const mongoose = require('mongoose')

const questionnaireSchema = mongoose.Schema({
        questionnaire1: {
            type: Object,
        },
        questionnaire2: {
            type: Object,
        },
        questionnaire3: {
            type: Object,
        },
        questionnaire4: {
            type: Object,
        },
        questionnaire5: {
            type: Object,
        },
        questionnaire6: {
            type: Object,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        }
    })

const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema)

module.exports = Questionnaire