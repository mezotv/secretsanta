const express = require('express')
const {
    loginUser,
    createUser,
    signupUser
} = require('../controllers/userController')

const router = express.Router()

// login route
router.post('/login', loginUser)

// create user route
router.post('/create', createUser)

// signup route
router.post('/signup', signupUser)

module.exports = router