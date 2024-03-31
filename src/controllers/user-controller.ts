import { type Request, type Response, type NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { errorMsg } from '../helpers/message-helper'
import { allNotNullOrEmpty } from '../helpers/validation-helper'

import User from '../models/user'

interface RequestBody {
  name: string
  email: string
  password: string
  checkpassword: string
}

class UserController {
  signUp (req: Request, res: Response, next: NextFunction): Record<string, any> | undefined {
    const { name, email, password, checkpassword } = req.body as RequestBody

    if (allNotNullOrEmpty(name, email, password)) {
      return errorMsg(res, 400, 'Name, email, and password are required fields.')
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorMsg(res, 400, 'The email format is invalid.')
    }

    if (password !== checkpassword) {
      return errorMsg(res, 400, 'Password does not match the confirmed password.')
    }

    void (async () => {
      try {
        const registeredEmail = await User.findOne({ email }).lean()

        if (registeredEmail != null) {
          return errorMsg(res, 400, 'Email has already been registered.')
        }

        const user = await User.create({
          name,
          email,
          password: await bcrypt.hash(password, 10),
          checkpassword
        })
        const { password: removedPassword, ...data } = user.toJSON()
        res.json(data)
      } catch (err) {
        next(err)
      }
    })()
  }

  signIn (req: Request, res: Response, next: NextFunction): Record<string, any> | undefined {
    const { email, password } = req.body as RequestBody

    if (allNotNullOrEmpty(email, password)) {
      return errorMsg(res, 400, 'Please enter your username and password.')
    }

    void (async () => {
      try {
        const user = await User.findOne({ email }).lean()

        if (user == null) {
          return errorMsg(res, 401, 'Incorrect username or password!')
        }

        await bcrypt.compare(password, user.password)
          ? (process.env.JWT_SECRET != null)
              ? res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                token: jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' })
              })
              : errorMsg(res, 500, 'JWT token encountered a generation error.')
          : errorMsg(res, 401, 'Incorrect username or password!')
      } catch (err) {
        next(err)
      }
    })()
  }
}

export default UserController
