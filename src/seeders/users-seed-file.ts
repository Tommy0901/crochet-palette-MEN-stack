import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

import users from './intial/users.json'
import User from '../models/user'

if (process.env.NODE_ENV !== 'production') dotenv.config()

const mongodbUri = process.env.MONGODB_URI

if (mongodbUri == null) throw new Error('MONGODB_URI is not defined.')

interface UserData {
  name: string
  email: string
  password: string
  avatar: string | null
}

void mongoose.connect(mongodbUri)

mongoose.connection.on('error', () => {
  console.log('MongoDB connet error!')
})

mongoose.connection.once('open', () => {
  console.log('MongoDB connet success!')
})

async function hashPasswords (users: UserData[]): Promise<void> {
  for (const i of users) {
    try {
      const hash = await bcrypt.hash(i.password, 10)
      i.password = hash
    } catch (err) {
      console.error(err)
    }
  }
}

// 呼叫函數並傳入 users 陣列
hashPasswords(users)
  .then(() => {
    void (async () => {
      try {
        console.log(await User.insertMany(users))
        void mongoose.disconnect()
      } catch (err) {
        console.log(err)
      }
    })()
  })
  .catch((err) => {
    console.error(err)
  })
