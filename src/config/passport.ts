import passport from 'passport'
import dotenv from 'dotenv'

import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'

import { User } from '../models'

if (process.env.NODE_ENV !== 'production') dotenv.config()
if (process.env.JWT_SECRET == null) throw new Error('JWT_SECRET is not defined.')

type DoneFunction = (error: Error | null, data?: Express.User) => void

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(jwtOptions,
  (jwtPayload, done: DoneFunction) => {
    void (async () => {
      try {
        const user = await User.findById(jwtPayload.id)
        if (user != null) {
          const { password, ...data } = user.toJSON()
          done(null, data)
        } else {
          done(new Error('User not found'))
        }
      } catch (err) {
        done(err as Error)
      }
    })()
  }
))

export default passport
