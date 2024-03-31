import type Route from './route'
import PaletteRoute from './palette'
import UserRoute from './user'

export const router: Route[] = [
  new PaletteRoute(),
  new UserRoute()
]
