const express = require('express')
const Admin = require('../../../../../models/admin')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');
var generator = require('generate-password');

router.post('/', async (req, res) => {

    try {
        const admin = await Admin.findOne({ email: req.body.email, password: req.body.password })

        if (admin) {
            res.cookie('user', admin._id)
            return res.status(200).json({
                message: "Student loggedin successfully!",
                user: admin,
                isAdmin: true
            })
        }

        return res.status(401).json({
            message: "Unauthorized!",
        })

    } catch (error) {

        return res.status(500).json({
            message: "Server error!",
        })

    }
})

router.post('/jwt', async (req, res) => {

    const admin = await Admin.findOne({ email: req.body.email, password: req.body.password })

    if (admin) {
        const token = jwt.sign(admin.id, process.env.JWT_KEY)
        // res.cookie('user', token)
        return res.status(200).json({
            message: "admin loggedin successfully!",
            user: admin,
            token,
            isAdmin: true
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

    const { email, name, sub } = payload
    const password = generator.generate({
        length: 8
    })

    console.log(payload)


    let admin = await Admin.findOne({ email: email })

    // create admin if it isn't in the DB
    if (!admin) {
        admin = await Admin.create({ email, name, roll: parseInt(sub), password })
    }

    const jwtToken = jwt.sign(admin.id, process.env.JWT_KEY)

    return res.status(200).json({
        message: "Google OAuth successful",
        user: admin,
        token: jwtToken,
        isAdmin: true
    })

})

module.exports = router
