const express = require('express')
const Student = require('../../../../models/student')
const router = express.Router()
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library');
var generator = require('generate-password');

router.post('/', async (req, res) => {

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
        const token = jwt.sign(student.id, process.env.JWT_KEY)
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

    const token = req.body.token

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    const {email, name, sub} = payload
    const password = generator.generate({
        length: 8
    })

    console.log(payload)

    
    let student = await Student.findOne({email: email})

    // create student if it isn't in the DB
    if(!student)
    {
        student = await Student.create({email, name, roll: parseInt(sub), password })
    }

    const jwtToken = jwt.sign(student.id, process.env.JWT_KEY)

    return res.status(200).json({
        message: "Google OAuth successful",
        student: student,
        token: jwtToken
    })

})

module.exports = router
