var express = require('express')
var router = express.Router()
const User = require('../models/User')
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')

/* GET users listing. */
router.post('/register', async function(req, res, next) {
  const { error } = registerValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const { name, email, password } = req.body

  const emailExist = await User.findOne({ email })
  if (emailExist) return res.status(400).send('Email already exists')

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(password, salt)

  const newUser = new User({
    name,
    email,
    password: hashPassword
  })
  try {
    const savedUser = await newUser.save()
    res.send(savedUser)
  } catch (err) {
    return res.status(400).send(err)
  }
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    console.log(err)
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : 'Login failed',
        user: user
      })
    }
    console.log(user)
    const userRes = {
      id: user._id,
      name: user.name,
      email: user.email
    }

    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err)
      }

      const token = jwt.sign(userRes, 'secretKey')

      return res.json({ token })
    })
  })(req, res)
})

module.exports = router
