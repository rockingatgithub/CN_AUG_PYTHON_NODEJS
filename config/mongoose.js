const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL)

const db = mongoose.connection

db.once('open', () => {
    console.log("DB connected successfully!")
})

module.exports = db