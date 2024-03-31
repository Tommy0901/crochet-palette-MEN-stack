import express, { type Request, type Response } from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import cors from 'cors'
import jwt from 'jsonwebtoken'

import User from './models/user'
import Palette from './models/palette'

if (process.env.NODE_ENV !== 'production') dotenv.config()

const app = express()
const port = process.env.PORT ?? 8080
const jwtSecret = process.env.JWT_SECRET
const mongodbUri = process.env.MONGODB_URI

if (jwtSecret == null) throw new Error('JWT_SECRET is not defined.')
if (mongodbUri == null) throw new Error('MONGODB_URI is not defined.')

interface RequestBody {
  name: string
  email: string
  password: string
  checkpassword: string
}

void mongoose.connect(mongodbUri)

mongoose.connection.on('error', () => {
  console.log('MongoDB connet error!')
})

mongoose.connection.once('open', () => {
  console.log('MongoDB connet success!')
})

app.use(cors(), express.json())

app.get('/palettes', (req: Request, res: Response): void => {
  void (async () => {
    try {
      res.json(await Palette.find())
    } catch (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    }
  })()
})

app.post('/signup', (req: Request, res: Response): Record<string, any> | undefined => {
  const { name, email, password, checkpassword } = req.body as RequestBody
  if (name === '' || email === '' || password === '') return res.status(401).send('name, email, password 為必填!')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(401).send('email 格式不符!')
  if (password !== checkpassword) return res.status(401).send('輸入密碼與確認密碼不符!')
  void (async () => {
    try {
      const user = await User.create({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        checkpassword
      })
      const { password: removedPassword, ...data } = user.toJSON()
      res.json(data)
    } catch (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    }
  })()
})

app.post('/signin', (req: Request, res: Response): Record<string, any> | undefined => {
  const { email, password } = req.body as RequestBody
  if (email === '' || password === '') return res.status(401).send('請輸入帳號及密碼!')
  void (async () => {
    try {
      const user = (await User.find({ email: { $in: [email] } }))[0]
      if (user === null) return res.status(401).send('帳號或密碼錯誤!')
      await bcrypt.compare(password, user.password)
        ? res.json({
          id: user._id,
          name: user.name,
          email: user.email,
          token: jwt.sign({ id: user._id, name: user.name, email: user.email }, jwtSecret, { expiresIn: '30d' })
        })
        : res.status(401).send('帳號或密碼錯誤!')
    } catch (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    }
  })()
})

app.get('/', (req: Request, res: Response) => res.send('This is crochet palette!'))

app.listen(port, () => { console.info(`Server is running on http://localhost:${port}`) })

export default app
