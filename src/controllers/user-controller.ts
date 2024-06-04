import { type Request, type Response, type NextFunction } from 'express'
import { type Types } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { User, Palette } from '../models'

import { type ErrorResponse, errorMsg } from '../helpers/message-helper'
import { allNotNullOrEmpty, idCheck } from '../helpers/validation-helper'

interface RequestBody {
  name: string
  email: string
  password: string
  checkpassword: string
}

class UserController {
  signUp (req: Request, res: Response, next: NextFunction): Response<ErrorResponse> | undefined {
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
          password: await bcrypt.hash(password, 10)
        })
        const { password: removedPassword, ...data } = user.toJSON()
        res.json(data)
      } catch (err) {
        next(err)
      }
    })()
  }

  signIn (req: Request, res: Response, next: NextFunction): Response<ErrorResponse> | undefined {
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

  userCreatePalette (req: Request, res: Response, next: NextFunction): Response<ErrorResponse> | undefined {
    const { _id: userId } = req.user as { _id: string | Types.ObjectId }
    const { paletteName, hexCode }: { paletteName: string, hexCode: string } = req.body

    if (allNotNullOrEmpty(paletteName, hexCode)) {
      return errorMsg(res, 400, 'Please input paletteName and hexCode.')
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(hexCode)) {
      return errorMsg(res, 400, 'The hexCode format is invalid.')
    }

    void (async () => {
      try {
        res.json(await Palette.create({ paletteName, hexCode, userId }))
      } catch (err) {
        next(err)
      }
    })()
  }

  userReadPalette (req: Request, res: Response, next: NextFunction): void {
    const { _id: userId } = req.user as { _id: string | Types.ObjectId }
    void (async () => {
      try {
        res.json(await Palette.find({ userId }).select('-__v').lean())
      } catch (err) {
        next(err)
      }
    })()
  }

  userUpdatePalette (req: Request, res: Response, next: NextFunction): Response<ErrorResponse> | undefined {
    const { _id: userId } = req.user as { _id: string | Types.ObjectId }
    const { paletteName, hexCode }: { paletteName: string, hexCode: string } = req.body
    const { id: _id } = req.params

    if (idCheck(_id)) return errorMsg(res, 400, "Please using valid palette's id created by user.")

    if (allNotNullOrEmpty(paletteName, hexCode)) {
      return errorMsg(res, 400, 'Please input paletteName and hexCode.')
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(hexCode)) {
      return errorMsg(res, 400, 'The hexCode format is invalid.')
    }

    const options = {
      new: true, // 返回更新后的文档
      lean: true,
      projection: { // 指定要返回的字段
        __v: 0 // 设置为 0 表示不返回 __v 字段
      }
    }

    void (async () => {
      try {
        res.json(await Palette.findOneAndUpdate({ _id, userId }, { paletteName, hexCode }, options))
      } catch (err) {
        next(err)
      }
    })()
  }

  userDeletePalette (req: Request, res: Response, next: NextFunction): Response<ErrorResponse> | undefined {
    const { _id: userId } = req.user as { _id: string | Types.ObjectId }
    const { id: _id } = req.params

    if (idCheck(_id)) return errorMsg(res, 400, "Please using valid palette's id created by user.")

    const options = {
      new: true, // 返回更新后的文档
      lean: true,
      projection: { // 指定要返回的字段
        __v: 0 // 设置为 0 表示不返回 __v 字段
      }
    }

    void (async () => {
      try {
        res.json(await Palette.findOneAndDelete({ _id, userId }, options))
      } catch (err) {
        next(err)
      }
    })()
  }
}

export default UserController
