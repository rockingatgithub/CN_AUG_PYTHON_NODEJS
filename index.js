const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const db = require('./config/mongoose')
const Student = require('./models/student')
const PORT = 8000
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library');
var generator = require('generate-password');


var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
  

app.use(cors(corsOptions))
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

const authenticateJWT = async (req, res, next) => {

    console.log(req.cookies.user)
    const studentID = jwt.verify(req.cookies.user, 'test')

    if(studentID) {

        const student = await Student.findById(studentID)
        if(student) {
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

app.use(requestCounter)

app.use(express.urlencoded())
app.use(express.json())

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

app.post('/jwt', async (req, res) => {

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

app.get('/student', authenticateJWT, async (req, res) => {

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

app.post('/google', async (req, res) => {

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

app.listen(PORT, () => {
    console.log("Express is running!")
})