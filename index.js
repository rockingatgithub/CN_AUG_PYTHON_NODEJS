const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const app = express()
const db = require('./config/mongoose')
const Student = require('./models/student')
const PORT = 8000


app.use(cookieParser())

let counter = 0;
const requestCounter = (req, res, next) => { 
    counter++;
    console.log("The total requests are: ", counter)
    next()
}

const authenticate = async (req, res, next) => {

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

app.use(requestCounter)

app.use(express.urlencoded())
app.use(express.json())


const student = [
    {
        name: 'abc',
        roll: 40
    },
    {
        name: 'abcd',
        roll: 41
    },
    {
        name: 'abcde',
        roll: 42
    }
]

app.post('/auth', async (req, res) => {

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

app.post('/student', async (req, res) => {

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

app.get('/student', authenticate, async (req, res) => {

    console.log(req.body)
    const students = await Student.find({})

    return res.status(200).json({
        message: "Student fetched successfully!",
        student: students
    })

})

app.put('/student/:id', authenticate ,async (req, res) => {

    console.log(req.body)
    console.log(req.params)
    const studentId = req.params.id

    const student = await Student.findByIdAndUpdate(studentId, req.body, { new: true })

    return res.status(200).json({
        message: "Student updated successfully!",
        student: student
    })

})


app.delete('/student', async (req, res) => {

    console.log(req.query)

    const studentId = req.query.id

    const student = await Student.findByIdAndDelete(studentId)

    return res.status(200).json({
        message: "Student deleted successfully!",
        student: student
    })

})











app.get('/home', (req, res) => {
    return res.end('<h1>The home page</h1>')
})

app.get('/about', (req, res) => {
    return res.end('<h1>The about page</h1>')
})

app.get('/login', (req, res) => {
    return res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/login', (req, res) => {

    console.log(req.body)

    return res.end('The data is received')

})

app.delete('/data', (req, res) => {



})


app.listen(PORT, () => {
    console.log("Express is running!")
})