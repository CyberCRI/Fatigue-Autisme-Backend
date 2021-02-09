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
        },
        child: {
            type: Object,
        }
    })

questionnaireSchema.statics.findByUser = async (userId) => {
    console.log(`>>Looking for a questionnaire with userId=` + userId);
    const questionnaire = await Questionnaire.findOne({ userId: userId });
    return questionnaire;
}

const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema)

module.exports = Questionnaire