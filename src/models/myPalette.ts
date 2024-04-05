import { model, Schema } from 'mongoose'
import User from './user'
import Palette from './palette'

const myPaletteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    unique: true,
    required: true
  },
  paletteId: [{
    type: Schema.Types.ObjectId,
    ref: Palette,
    required: true
  }]
})

export default model('MyPalette', myPaletteSchema)
