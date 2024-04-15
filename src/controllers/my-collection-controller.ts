import { type Request, type Response, type NextFunction } from 'express'
import { type Types } from 'mongoose'

import { MyCollection } from '../models'

import { errorMsg } from '../helpers/message-helper'
import { idCheck } from '../helpers/validation-helper'

class MyCollectionController {
  addMyCollection (req: Request, res: Response, next: NextFunction): Record<string, any> | undefined {
    const { _id: userId } = req.user as { _id: string | Types.ObjectId }
    const { colorSchema }: { colorSchema: string[] } = req.body
    if (colorSchema == null) return errorMsg(res, 400, 'Please input the array of hexcodes.')
    if (!colorSchema.every(i => /^#[0-9A-Fa-f]{6}$/.test(i))) return errorMsg(res, 400, 'The hexCode format is invalid.')

    void (async () => {
      try {
        res.json(await MyCollection.create({ userId, colorSchema }))
      } catch (err) {
        next(err)
      }
    })()
  }

  showMyCollections (req: Request, res: Response, next: NextFunction): void {
    const { _id: userId } = req.user as { _id: string | Types.ObjectId }

    void (async () => {
      try {
        res.json(await MyCollection.find({ userId }).select('-__v').sort({ _id: -1 }).lean())
      } catch (err) {
        next(err)
      }
    })()
  }

  updateMyCollection (req: Request, res: Response, next: NextFunction): Record<string, any> | undefined {
    const { id: _id } = req.params
    const { _id: userId } = req.user as { _id: string | Types.ObjectId }
    const { colorSchema }: { colorSchema: string[] } = req.body
    if (colorSchema == null) return errorMsg(res, 400, 'Please input the array of hexcodes.')
    if (!colorSchema.every(i => /^#[0-9A-Fa-f]{6}$/.test(i))) return errorMsg(res, 400, 'The hexCode format is invalid.')
    if (idCheck(_id)) return errorMsg(res, 400, 'Please use the valid id of user collection.')

    const options = {
      new: true, // 返回更新后的文档
      lean: true
    }

    void (async () => {
      try {
        res.json(await MyCollection.findOneAndUpdate({ _id, userId }, { colorSchema }, options).select('-__v'))
      } catch (err) {
        next(err)
      }
    })()
  }

  removeMyCollection (req: Request, res: Response, next: NextFunction): Record<string, any> | undefined {
    const { id: _id } = req.params
    const { _id: userId } = req.user as { _id: string | Types.ObjectId }

    if (idCheck(_id)) return errorMsg(res, 400, 'Please use the valid id of user collection.')

    void (async () => {
      try {
        res.json(await MyCollection.findOneAndDelete({ _id, userId }).select('-__v'))
      } catch (err) {
        next(err)
      }
    })()
  }
}

export default MyCollectionController
