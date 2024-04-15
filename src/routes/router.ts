import type Route from './route'
import UserRoute from './user'
import PaletteRoute from './palette'
import BrandPaletteRoute from './brand-palette'

export const router: Route[] = [
  new UserRoute(),
  new PaletteRoute(),
  new BrandPaletteRoute()
]
