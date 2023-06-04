const Student = require("../models/student")
const jwt = require('jsonwebtoken')

exports.authenticateJWT = async (req, res, next) => {

    console.log( req.body.user)
    const studentID = jwt.verify(req.body.user, process.env.JWT_KEY)

    if(studentID) {

        const student = await Student.findById(studentID)
        if(student) {
            req.user = student
            next()
        
        } else {
                return res.status(401).json({
                    message: "Unauthorized!",
                })
        }

    }
     else {

        return res.status(401).json({
            message: "Unauthorized!",
        })

    }

    // test what if else not used!

}

exports.authenticate = async (req, res, next) => {

    console.log(req.cookies)

    const student = await Student.findById(req.cookies.user)
    if(student) {
        next()
    } else {

        return res.status(401).json({
            message: "Unauthorized!",
        })

    }

    // test what if else not used!

}