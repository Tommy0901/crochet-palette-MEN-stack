import { model, Schema } from 'mongoose'

import { Palette } from './'

const brandPaletteSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  paletteIds: [{
    type: Schema.Types.ObjectId,
    ref: Palette,
    required: true
  }]
})

export default model('BrandPalette', brandPaletteSchema)
