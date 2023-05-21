const express = require('express')
const Student = require('../../../../models/student')
const router = express.Router()
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library');
var generator = require('generate-password');

router.post('/auth', async (req, res) => {

    const student = await Student.findOne({email: req.body.email, password: req.body.password})

    if(student) {
        res.cookie('user', student._id)
        return res.status(200).json({
            message: "Student loggedin successfully!",
            student
        })
    }

    return res.status(401).json({
        message: "Unauthorized!",
    })

})

router.post('/jwt', async (req, res) => {

    const student = await Student.findOne({email: req.body.email, password: req.body.password})

    if(student) {
        const token = jwt.sign(student.id, 'test')
        // res.cookie('user', token)
        return res.status(200).json({
            message: "Student loggedin successfully!",
            student,
            token
        })
    }

    return res.status(401).json({
        message: "Unauthorized!",
    })

})

router.post('/google', async (req, res) => {

    console.log(req.headers['Sec-Ch-Ua-Platform'])

    const token = req.body.token

    const client = new OAuth2Client('877608648724-rjcmq7oemsqjbu3r8k9rqo1i7jsu9h8b.apps.googleusercontent.com')
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '877608648724-rjcmq7oemsqjbu3r8k9rqo1i7jsu9h8b.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    const {email, name, sub} = payload
    const password = generator.generate({
        length: 8
    })

    
    let student = await Student.findOne({email: email})

    // create student if it isn't in the DB
    if(!student)
    {
        student = await Student.create({email, name, roll: parseInt(sub), password })
    }

    return res.status(200).json({
        message: "Google OAuth successful",
        student: student
    })

})

module.exports = router
