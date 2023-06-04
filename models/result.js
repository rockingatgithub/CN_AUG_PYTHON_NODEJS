const mongoose = require('mongoose')


const resultSchema = new mongoose.Schema({

    candidate: {
        type: mongoose.Types.ObjectId,
        ref: 'Student',
        required: true
    },

    interview: {
        type: mongoose.Types.ObjectId,
        ref: 'Interview',
        required: true
    },

    date: {
        type: Date,
        required: true,
    },

    result: {
        type: String,
        required: true,
        enum: [ 'PASS', 'FAIL', 'PENDING' ]
    },

    evaluatedBy: {
        type: mongoose.Types.ObjectId,
        ref: ''
    }

})

const Result = mongoose.model('Result', resultSchema)
module.exports = Result