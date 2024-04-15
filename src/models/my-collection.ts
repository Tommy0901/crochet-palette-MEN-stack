import { model, Schema } from 'mongoose'

import { User } from '.'

const myCollectionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  collection: {
    type: [String],
    required: true
  }
})

export default model('my_collections', myCollectionSchema)
