import bcrypt from 'bcryptjs'

import User from '../models/user'
import users from './intial/users.json'

interface UserData {
  name: string
  email: string
  password: string
  avatar: string | null
}

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

export async function initializeUsers (): Promise<void> {
  try {
    await hashPasswords(users)
    console.log('initializeUsers:\n', await User.insertMany(users))
  } catch (err) {
    console.log(err)
  }
}
