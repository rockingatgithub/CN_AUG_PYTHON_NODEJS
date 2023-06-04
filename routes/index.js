const express = require('express')
const router = express.Router()

router.use('/api', require('./api'))
router.use('/login', (req, res) => {
    return res.status(401).json({
        message: "Unauthorized"
    })
})

module.exports = router