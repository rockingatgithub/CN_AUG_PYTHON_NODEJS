const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()
const passport = require('./config/passportJWTStrategy')
const app = express()
const db = require('./config/mongoose')
const PORT = 8000

// var corsOptions = {
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
  
// middlewares
// app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.urlencoded())
app.use(express.json())
passport.initialize()
app.use('/', require('./routes'))


app.listen(PORT, () => {
    console.log("Express is running!")
})