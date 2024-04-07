import { type Request, type Response, type NextFunction } from 'express'

import { User, Palette, MyPalette, BrandPalette } from '../models'

import { errorMsg } from '../helpers/message-helper'
import { idCheck } from '../helpers/validation-helper'

class MyPaletteController {
  addMyPalette (req: Request, res: Response, next: NextFunction): Record<string, any> | undefined {
    const userId = (req.user as { _id: object })?._id

    const { brandId }: { brandId: string } = req.body

    if (idCheck(brandId)) return errorMsg(res, 400, "Please using valid brand's id.")

    const paths = [
      {
        path: 'userId',
        model: User,
        select: ['-_id', 'name', 'email'],
        as: 'user'
      },
      {
        path: 'brandId',
        model: BrandPalette,
        select: ['name', 'paletteIds'],
        populate: {
          path: 'paletteIds',
          model: Palette,
          select: ['-_id', 'paletteId', 'paletteName', 'hexCode']
        }
      }
    ]

    void (async () => {
      try {
        const brand = await BrandPalette.findById(brandId)
        if (brand == null) return errorMsg(res, 400, "Brand doesn't existed.")
        const myPalette = await MyPalette.findOne({ userId, brandId })
        if (myPalette?.name === null) return errorMsg(res, 400, 'This brand is already in the My Palette list')

        const { _id: id } = await MyPalette.create({ userId, brandId })
        const addToMyPalete = await MyPalette.findById(id).populate(paths)

        res.json({
          _id: addToMyPalete?._id,
          name: addToMyPalete?.name,
          user: addToMyPalete?.userId,
          brand: addToMyPalete?.brandId
        })
      } catch (err) {
        next(err)
      }
    })()
  }

  getMyPalettes (req: Request, res: Response, next: NextFunction): void {
    const userId = (req.user as { _id: object })?._id

    const paths = [
      {
        path: 'userId',
        model: User,
        select: ['-_id', 'name', 'email'],
        as: 'user'
      },
      {
        path: 'brandId',
        model: BrandPalette,
        select: ['name', 'paletteIds'],
        populate: {
          path: 'paletteIds',
          model: Palette,
          select: ['-_id', 'paletteId', 'paletteName', 'hexCode']
        }
      }
    ]

    void (async () => {
      try {
        const myPalettes = await MyPalette.find({ userId }).populate(paths).sort({ _id: -1 })

        myPalettes.forEach(i => i.toJSON())

        res.json(myPalettes.map(myPalette => ({
          _id: myPalette._id,
          name: myPalette.name,
          user: myPalette.userId,
          brand: myPalette.brandId
        })))
      } catch (err) {
        next(err)
      }
    })()
  }

  putMyPalette (req: Request, res: Response, next: NextFunction): Record<string, any> | undefined {
    const { id: _id } = req.params
    const { name } = req.body

    const userId = (req.user as { _id: object })?._id

    if (name === '') return errorMsg(res, 400, 'Please enter the customized name of brand.')
    if (idCheck(_id)) return errorMsg(res, 400, 'Please using valid id of my palette.')

    const options = {
      new: true, // 返回更新后的文档
      lean: true
    }

    const paths = [
      {
        path: 'userId',
        model: User,
        select: ['-_id', 'name', 'email'],
        as: 'user'
      },
      {
        path: 'brandId',
        model: BrandPalette,
        select: ['name', 'paletteIds'],
        populate: {
          path: 'paletteIds',
          model: Palette,
          select: ['-_id', 'paletteId', 'paletteName', 'hexCode']
        }
      }
    ]

    void (async () => {
      try {
        const [myPalette, myPaletteName] = await Promise.all([MyPalette.findById(_id), name != null ? MyPalette.findOne({ name, userId }) : undefined])
        if (myPalette == null) return errorMsg(res, 400, "Can't find any record in the list of My Palette.")
        if (String(myPalette?.userId) !== String(userId)) return errorMsg(res, 403, 'Update failed! Insufficient permissions.')
        if (myPaletteName != null && String(myPaletteName._id) !== _id) return errorMsg(res, 400, "Duplicate customized brand's name")

        res.json(await MyPalette.findByIdAndUpdate(_id, { name }, options).populate(paths).select('-__v'))
      } catch (err) {
        next(err)
      }
    })()
  }

  deleteMyPalette (req: Request, res: Response, next: NextFunction): Record<string, any> | undefined {
    const { id: _id } = req.params

    const userId = (req.user as { _id: object })?._id

    if (idCheck(_id)) return errorMsg(res, 400, 'Please using valid id of my palette.')

    const paths = [
      {
        path: 'userId',
        model: User,
        select: ['-_id', 'name', 'email'],
        as: 'user'
      },
      {
        path: 'brandId',
        model: BrandPalette,
        select: ['name', 'paletteIds'],
        populate: {
          path: 'paletteIds',
          model: Palette,
          select: ['-_id', 'paletteId', 'paletteName', 'hexCode']
        }
      }
    ]

    void (async () => {
      try {
        const myPalette = await MyPalette.findById(_id)
        if (myPalette == null) return errorMsg(res, 400, "Can't find any record in the list of My Palette.")
        if (String(myPalette?.userId) !== String(userId)) return errorMsg(res, 403, 'Delete failed! Insufficient permissions.')

        res.json(await MyPalette.findByIdAndDelete(_id).populate(paths).select('-__v'))
      } catch (err) {
        next(err)
      }
    })()
  }
}

export default MyPaletteController
