const passport = require('passport')
const passportJWT = require('passport-jwt')

const ExtractJWT = passportJWT.ExtractJwt

const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = passportJWT.Strategy
const User = require('./models/User')
const bcrypt = require('bcryptjs')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, cb) {
      //Assume there is a DB module pproviding a global UserModel
      return User.findOne({ email })
        .then(user => {
          if (!user) {
            return cb(null, false, { message: 'Incorrect email or password.' })
          }

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err
            if (isMatch) {
              return cb(null, user, {
                message: 'Logged In Successfully'
              })
            }
            return cb(null, false, { message: 'Incorrect email or password.' })
          })
        })
        .catch(err => {
          return cb(err)
        })
    }
  )
)

// passport.use(
//   new JWTStrategy(
//     {
//       jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//       secretOrKey: 'your_jwt_secret'
//     },
//     function(jwtPayload, cb) {
//       //find the user in db if needed
//       return UserModel.findOneById(jwtPayload.id)
//         .then(user => {
//           return cb(null, user)
//         })
//         .catch(err => {
//           return cb(err)
//         })
//     }
//   )
// )
