require('dotenv').config()
const express = require('express')
const cors = require('cors')
// const path = require('path')
const https = require("https");
const fs = require("fs")

const indexRouter = require('./routers/Index')
const userRouter = require('./routers/User')
const renseignementRouter = require('./routers/Renseignement')
const questionnaireRouter = require('./routers/Questionnaire')

const port = process.env.PORT
const nodeEnv = process.env.NODE_ENV || 'dev'

require('./db/db')

const app = express()

app.use(express.json())

app.use(cors())


app.use(indexRouter)
app.use(userRouter)
app.use(renseignementRouter)
app.use(questionnaireRouter)

if(nodeEnv == 'production'){
    https.createServer({
            key: fs.readFileSync("./private.key"),
            cert: fs.readFileSync("./certificate.crt"),
        },
        app).listen(process.env.PORT || 3000, () => {
        console.log(
            "NodeJS: Express Server I listening on Port:" + process.env.PORT + " in mode :" + process.env.nodeEnv
        );
    });
} else {
    app.listen(port, () => {
        console.log(`Server running on port ${port}` + ' in mode: development')
        console.log(__dirname)
    })
}