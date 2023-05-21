const express = require('express')
const { authenticateJWT, authenticate } = require('../../../../middlewares/auth_middlewares')
const Student = require('../../../../models/student')
const router = express.Router()


router.post('/', async (req, res) => {

    try {

        const student = await Student.create(req.body)
    
        return res.status(200).json({
            message: "Student added successfully!",
            student: student
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

router.put('/:id', authenticate ,async (req, res) => {

    console.log(req.body)
    console.log(req.params)
    const studentId = req.params.id

    const student = await Student.findByIdAndUpdate(studentId, req.body, { new: true })

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