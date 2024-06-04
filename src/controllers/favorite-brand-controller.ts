import { type Request, type Response, type NextFunction } from 'express'
import { type Types } from 'mongoose'

import { User, Palette, FavoriteBrand, BrandPalette } from '../models'

import { type ErrorResponse, errorMsg } from '../helpers/message-helper'
import { idCheck } from '../helpers/validation-helper'

class FavoriteBrandController {
  addMyFavorite (req: Request, res: Response, next: NextFunction): Response<ErrorResponse> | undefined {
    const userId = (req.user as { _id: string | Types.ObjectId })?._id

    const { brandId }: { brandId: string } = req.body

    if (idCheck(brandId)) return errorMsg(res, 400, "Please use valid brand's id.")

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
        const [currentBrand, favoriteBrand] = await Promise.all([
          BrandPalette.findById(brandId), FavoriteBrand.findOne({ name: undefined, userId, brandId })
        ])
        if (currentBrand == null) return errorMsg(res, 400, "Brand doesn't existed.")
        if (favoriteBrand != null) return errorMsg(res, 400, 'This brand is already in your favorites list.')

        const { _id: id } = await FavoriteBrand.create({ userId, brandId })
        const { _id, name, userId: user, brandId: brand } = await FavoriteBrand
          .findById(id)
          .populate(paths) as { _id: Types.ObjectId, name: string | null, userId: object, brandId: object }

        res.json({ _id, name, user, brand })
      } catch (err) {
        next(err)
      }
    })()
  }

  showMyFavorites (req: Request, res: Response, next: NextFunction): void {
    const userId = (req.user as { _id: string | Types.ObjectId })?._id

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
        const favoriteBrands = await FavoriteBrand.find({ userId }).populate(paths).sort({ _id: -1 })

        favoriteBrands.forEach(i => i.toJSON())

        res.json(favoriteBrands.map(item => ({
          _id: item._id,
          name: item.name,
          user: item.userId,
          brand: item.brandId
        })))
      } catch (err) {
        next(err)
      }
    })()
  }

  updateMyFavorite (req: Request, res: Response, next: NextFunction): Response<ErrorResponse> | undefined {
    const { id: _id } = req.params
    const { name } = req.body

    const userId = (req.user as { _id: string | Types.ObjectId })?._id

    if (name === '') return errorMsg(res, 400, 'Please enter the customized name of brand.')
    if (idCheck(_id)) return errorMsg(res, 400, 'Please use valid id of my favorite brand.')

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
        const [favoriteBrand, favoriteBrandName] = await Promise.all([FavoriteBrand.findById(_id), (name != null ? FavoriteBrand.findOne({ name, userId }) : undefined)])
        if (favoriteBrand == null) return errorMsg(res, 400, "Can't find any record in my favorite brands.")
        if (String(favoriteBrand.userId) !== String(userId)) return errorMsg(res, 403, 'Update failed! Insufficient permissions.')
        if (favoriteBrandName != null && String(favoriteBrandName._id) !== _id) return errorMsg(res, 400, "Duplicate customized brand's name")

        res.json(await FavoriteBrand.findByIdAndUpdate(_id, { name }, options).populate(paths).select('-__v'))
      } catch (err) {
        next(err)
      }
    })()
  }

  removeMyFavorite (req: Request, res: Response, next: NextFunction): Response<ErrorResponse> | undefined {
    const { id: _id } = req.params

    const userId = (req.user as { _id: string | Types.ObjectId })?._id

    if (idCheck(_id)) return errorMsg(res, 400, 'Please use valid id of my favorite brand.')

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
        const favoriteBrand = await FavoriteBrand.findById(_id)
        if (favoriteBrand == null) return errorMsg(res, 400, "Can't find any record in my favorite brands.")
        if (String(favoriteBrand.userId) !== String(userId)) return errorMsg(res, 403, 'Delete failed! Insufficient permissions.')

        res.json(await FavoriteBrand.findByIdAndDelete(_id).populate(paths).select('-__v'))
      } catch (err) {
        next(err)
      }
    })()
  }
}

export default FavoriteBrandController
