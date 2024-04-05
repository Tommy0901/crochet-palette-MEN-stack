import type Route from './route'
import MyPaletteRoute from './myPalette'
import PaletteRoute from './palette'
import UserRoute from './user'

export const router: Route[] = [
  new MyPaletteRoute(),
  new PaletteRoute(),
  new UserRoute()
]
