import mongoose from 'mongoose'
import dotenv from 'dotenv'

import palettes from './intial/palettes.json'
import Palette from '../models/palette'

if (process.env.NODE_ENV !== 'production') dotenv.config()

const mongodbUri = process.env.MONGODB_URI

if (mongodbUri == null) throw new Error('MONGODB_URI is not defined.')

void mongoose.connect(mongodbUri)

mongoose.connection.on('error', () => {
  console.log('MongoDB connet error!')
})

mongoose.connection.once('open', () => {
  console.log('MongoDB connet success!')
})

void (async () => {
  try {
    console.log(await Palette.insertMany(palettes))
    void mongoose.disconnect()
  } catch (err) {
    console.log(err)
  }
})()
