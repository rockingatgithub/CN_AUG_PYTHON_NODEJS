const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },

    interviews: [{
        type: mongoose.Types.ObjectId,
        ref: 'Interview'
    }],

    results: [{
        type: mongoose.Types.ObjectId,
        ref: 'Result'
    }]

})

const Student = mongoose.model('Student', StudentSchema)
module.exports = Student