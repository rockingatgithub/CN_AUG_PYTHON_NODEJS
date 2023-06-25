const { application } = require('express')
const mongoose = require('mongoose')

const database = mongoose.connect(process.env.MONGODB_URL)

const db = mongoose.connection

db.once('open', () => {
    console.log("DB connected successfully!")
})

module.exports = database