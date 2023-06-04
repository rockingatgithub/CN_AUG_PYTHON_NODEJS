const express =  require('express');
const Admin = require('../../../../models/admin');
const router = express.Router()
const jwt = require('jsonwebtoken')


router.post('/',  async (req, res) => {

    const admin = await Admin.create(req.body)
    const jwtToken = jwt.sign(admin.id, 'test')

    return res.status(200).json({
        message: "Admin",
        token: jwtToken,
        admin
    })

})

module.exports = router;