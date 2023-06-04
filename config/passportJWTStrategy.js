const passport = require('passport')
const { ExtractJwt } = require('passport-jwt')
const Student = require('../models/student')
const JWTStrategy = require('passport-jwt').Strategy

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY
}

const jwtVerify = async (payload, done) => {
    try {
        const student = await Student.findById(payload)
        if (student) {
            done(null, student)
        } else {
            done(null, false)
        }
    } catch (error) {
        done(error, false)
    }
}

passport.use(new JWTStrategy(jwtOptions, jwtVerify))

module.exports = passport