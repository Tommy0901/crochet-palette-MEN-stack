import { model, Schema } from 'mongoose'

import { User } from './'

const paletteSchema = new Schema({
  paletteId: {
    type: Number,
    unique: true,
    sparse: true
  },
  paletteName: {
    type: String,
    required: true
  },
  hexCode: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: User
  }
})

export default model('Palette', paletteSchema)
