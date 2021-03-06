const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: value => {
                if (!validator.isEmail(value)) {
                    throw new Error({error: 'Invalid Email address'})
                }
            }
        },
        password: {
            type: String,
            required: true,
            minLength: 7
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }],
        created: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            default: 'Active'
        },
        consent: {
            type: Boolean,
            default: false
        },
        isParent: {
            type: Boolean,
            default: true
        },
        parentId: {
            type: String,
            default: ''
        }
    })

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    //For parents, we save the last 8 digits of the ObjectId as the uniqueId used to link parents and children
    if (user.isParent) {
        const stringId = user._id.toString();
        const parentId = stringId.substr(stringId.length - 8);
        user.parentId = parentId
    } 
    next()
})

userSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ email} )
    if (user === null) {
        throw new Error({ error : 'Identifiants invalides' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Identifiants invalides' })
    }
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User