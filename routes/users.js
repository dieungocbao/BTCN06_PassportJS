var express = require('express')
var router = express.Router()
const User = require('../models/User')
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs')

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

router.post('/login', async function(req, res, next) {d
  const { error } = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const { email, password } = req.body


})

module.exports = router
