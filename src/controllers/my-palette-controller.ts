import { type Request, type Response, type NextFunction } from 'express'

import Palette from '../models/palette'
import MyPalette from '../models/myPalette'

import { errorMsg } from '../helpers/message-helper'

class MyPaletteController {
  upsertMyPalettes (req: Request, res: Response, next: NextFunction): Record<string, any> | undefined {
    const userId = (req.user as { _id: string })?._id

    const { paletteId: $in } = req.body

    if ($in == null) return errorMsg(res, 400, 'Please input the array of paletteIds.')

    const options = {
      new: true, // 返回更新后的文档
      upsert: true, // 如果文档不存在，则创建一个新文档
      lean: true
    }

    const populate = [
      {
        path: 'userId',
        select: ['-_id', 'name', 'email']
      },
      {
        path: 'paletteId',
        select: ['-_id', 'paletteId', 'paletteName', 'hexCode']
      }
    ]

    void (async () => {
      try {
        const palettes = await Palette.find({ paletteId: { $in } })
        const paletteId = palettes.map(palette => palette._id)
        res.json(await MyPalette.findOneAndUpdate({ userId }, { paletteId }, options).populate(populate).select('-__v').lean())
      } catch (err) {
        next(err)
      }
    })()
  }
}

export default MyPaletteController
