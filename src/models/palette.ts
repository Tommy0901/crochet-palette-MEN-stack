import { model, Schema } from 'mongoose'

const paletteSchema = new Schema({
  paletteId: {
    type: Number,
    unique: true,
    required: true
  },
  paletteName: {
    type: String,
    required: true
  },
  hexCode: {
    type: String,
    required: true
  }
})

export default model('Palette', paletteSchema)
