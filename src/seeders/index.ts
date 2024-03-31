import dotenv from 'dotenv'

import { connectToMongoDB, disconnectFromMongoDB } from '../config/mongoose'
import { initializeUsers } from './users-seed-file'
import { initializePalettes } from './palettes-seed-file'

void (async () => {
  if (process.env.NODE_ENV !== 'production') dotenv.config()
  if (process.env.MONGODB_URI == null) throw new Error('MONGODB_URI is not defined.')
  try {
    connectToMongoDB(process.env.MONGODB_URI)
    await initializeUsers()
    await initializePalettes()
  } catch (err) {
    console.error('Error connecting to MongoDB:', err)
  } finally {
    disconnectFromMongoDB()
  }
})()
