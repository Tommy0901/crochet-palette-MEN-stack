import { model, Schema } from 'mongoose'

import { User, BrandPalette } from '.'

const favoriteBrandSchema = new Schema({
  name: {
    type: String,
    default: null
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  brandId: {
    type: Schema.Types.ObjectId,
    ref: BrandPalette,
    required: true
  }
})

export default model('favorite_brands', favoriteBrandSchema)
