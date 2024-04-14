import { type Request, type Response, type NextFunction } from 'express'

import { Palette } from '../models'
import { idCheck } from '../helpers/validation-helper'
import { errorMsg } from '../helpers/message-helper'

class PaletteController {
  getPalettes (req: Request, res: Response, next: NextFunction): void {
    const { paletteId, paletteName, hexCode, userId } = req.query

    // 創建一個空的查詢條件對象
    const queryOptions: Record<string, any> = {}

    // 如果 paletteId 存在，則將它作為條件之一
    if (paletteId != null && paletteId !== '') {
      queryOptions.paletteId = paletteId
    }

    // 如果 paletteName 存在，則創建正則表達式來進行模糊搜索
    if (paletteName != null && paletteName !== '') {
      queryOptions.paletteName = { $regex: paletteName, $options: 'i' }
    }

    // 如果 hexCode 存在，則將它作為條件之一
    if (hexCode != null && hexCode !== '') {
      queryOptions.hexCode = hexCode
    }

    if (userId != null && userId !== '') {
      if (idCheck(String(userId))) { errorMsg(res, 400, 'Please using valid user id.'); return }
      queryOptions.userId = userId
    }

    void (async () => {
      try {
        res.json(await Palette.find(queryOptions).lean())
      } catch (err) {
        next(err)
      }
    })()
  }
}

export default PaletteController
