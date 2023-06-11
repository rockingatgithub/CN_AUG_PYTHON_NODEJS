const express = require('express');
const Admin = require('../../../../models/admin');
const router = express.Router()
const jwt = require('jsonwebtoken')

router.use('/auth', require('./auth'))
router.post('/', async (req, res) => {

    try {

        const admin = await Admin.create(req.body)
        const jwtToken = jwt.sign(admin.id, 'test')

        return res.status(200).json({
            message: "Admin",
            token: jwtToken,
            user: admin,
            isAdmin: true
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server error"
        })
    }



})

module.exports = router;