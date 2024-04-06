import type Route from './route'
import BrandPaletteRoute from './brand-palette'
import MyPaletteRoute from './my-palette'
import PaletteRoute from './palette'
import UserRoute from './user'

export const router: Route[] = [
  new BrandPaletteRoute(),
  new MyPaletteRoute(),
  new PaletteRoute(),
  new UserRoute()
]
