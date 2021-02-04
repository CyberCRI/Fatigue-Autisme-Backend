const mongoose = require('mongoose');

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(err => console.error("Connection error", err));