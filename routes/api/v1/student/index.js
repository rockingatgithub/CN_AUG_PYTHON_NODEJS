const express = require('express')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const { sendMail } = require('../../../../mailers/google')
const { authenticateJWT, authenticate } = require('../../../../middlewares/auth_middlewares')
const Student = require('../../../../models/student')
const passport = require('passport')
const router = express.Router()


router.post('/', async (req, res) => {

    try {

        const student = await Student.create(req.body)
        const token = jwt.sign(student.id, process.env.JWT_KEY)
    
        return res.status(200).json({
            message: "Student added successfully!",
            student,
            token: token
        })

    }catch(error) {
        console.log(error)
        return res.status(500).json({
            message: "Student not added!"
        })
    }

    

})

router.get('/', authenticateJWT, async (req, res) => {

    console.log(req.body)
    const students = await Student.find({})

    return res.status(200).json({
        message: "Student fetched successfully!",
        student: students
    })

})

router.put('/', passport.authenticate('jwt', { failureRedirect: '/login', session: false })  , async (req, res) => {
    const studentId = req.user.id

    console.log("passport user", req.user)

    const student = await Student.findByIdAndUpdate(studentId, req.body, { new: true })

    console.log('path', path.join(__dirname, '../../../mailers/google/template.html'))

    sendMail(
        student.email, 
        'Updated request received.',
        `The name has been updated to ${student.name}`,
        fs.readFileSync(path.join(__dirname, '../../../../mailers/google/template.html'))
    )

    return res.status(200).json({
        message: "Student updated successfully!",
        student: student
    })

})


router.delete('/', async (req, res) => {

    console.log(req.query)

    const studentId = req.query.id

    const student = await Student.findByIdAndDelete(studentId)

    return res.status(200).json({
        message: "Student deleted successfully!",
        student: student
    })

})


module.exports = router