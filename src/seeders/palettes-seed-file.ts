import mongoose from 'mongoose'
import Palette from '../models/palette'

import palettes from './intial/palettes.json'

void mongoose.connect('mongodb://127.0.0.1:27017/crochet_palettes')

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
    console.error(err)
  }
})()
