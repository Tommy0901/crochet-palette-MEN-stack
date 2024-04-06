import { type Request, type Response, type NextFunction } from 'express'

import Palette from '../models/palette'
import BrandPalette from '../models/brand-palette'

import { errorMsg } from '../helpers/message-helper'
import { idCheck } from '../helpers/validation-helper'

class BrandPaletteController {
  postBrand (req: Request, res: Response, next: NextFunction): Record<string, any> | undefined {
    const { name, paletteIds: $in } = req.body

    if (name == null) return errorMsg(res, 400, "Please enter the name of palette's brand.")
    if ($in == null) return errorMsg(res, 400, 'Please input the array of paletteIds.')

    const paths = {
      path: 'paletteIds',
      model: Palette,
      select: ['-_id', 'paletteId', 'paletteName', 'hexCode']
    }

    void (async () => {
      try {
        const [brandName, palettes] = await Promise.all([BrandPalette.findOne({ name }), Palette.find({ paletteId: { $in } })])
        if (brandName != null) return errorMsg(res, 400, "Duplicate brand's name")
        const paletteIds = palettes.map(palette => palette._id)
        const { _id: id } = await BrandPalette.create({ name, paletteIds })

        res.json(await BrandPalette.findById(id).populate(paths).select('-__v'))
      } catch (err) {
        next(err)
      }
    })()
  }

  getBrands (req: Request, res: Response, next: NextFunction): void {
    const { name } = req.query

    // 創建一個空的查詢條件對象
    const queryOptions: Record<string, any> = {}

    // 如果 name 存在，則將它作為條件之一
    if (name != null && name !== '') {
      queryOptions.name = { $regex: name, $options: 'i' }
    }

    const paths = {
      path: 'paletteIds',
      model: Palette,
      select: ['-_id', 'paletteId', 'paletteName', 'hexCode']
    }

    void (async () => {
      try {
        res.json(await BrandPalette.find(queryOptions).populate(paths).select('-__v').sort({ _id: -1 }))
      } catch (err) {
        next(err)
      }
    })()
  }

  putBrand (req: Request, res: Response, next: NextFunction): Record<string, any> | undefined {
    const { id: _id } = req.params
    const { name, paletteIds: $in } = req.body

    if (name == null) return errorMsg(res, 400, "Please enter the name of palette's brand.")
    if ($in == null) return errorMsg(res, 400, 'Please input the array of paletteIds.')
    if (idCheck(_id)) return errorMsg(res, 400, "Please using valid brand's id.")

    const options = {
      new: true, // 返回更新后的文档
      lean: true
    }

    const paths = {
      path: 'paletteIds',
      model: Palette,
      select: ['-_id', 'paletteId', 'paletteName', 'hexCode']
    }

    void (async () => {
      try {
        const [brand, brandName, palettes] = await Promise.all([BrandPalette.findById(_id), BrandPalette.findOne({ name }), Palette.find({ paletteId: { $in } })])
        if (brand == null) return errorMsg(res, 404, "Brand doesn't existed.")
        if (brandName != null && String(brandName._id) !== _id) return errorMsg(res, 400, "Duplicate brand's name")
        const paletteIds = palettes.map(palette => palette._id)

        res.json(await BrandPalette.findByIdAndUpdate(_id, { name, paletteIds }, options).populate(paths).select('-__v'))
      } catch (err) {
        next(err)
      }
    })()
  }

  deleteBrand (req: Request, res: Response, next: NextFunction): Record<string, any> | undefined {
    const { id: _id } = req.params

    if (idCheck(_id)) return errorMsg(res, 400, "Please using valid brand's id.")

    const paths = {
      path: 'paletteIds',
      model: Palette,
      select: ['-_id', 'paletteId', 'paletteName', 'hexCode']
    }

    void (async () => {
      try {
        res.json(await BrandPalette.findByIdAndDelete(_id).populate(paths).select('-__v'))
      } catch (err) {
        next(err)
      }
    })()
  }
}

export default BrandPaletteController
