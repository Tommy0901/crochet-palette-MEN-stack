import MyPaletteController from '../controllers/my-palette-controller'
import { authenticated } from '../middlewares/auth-handler'
import Route from './route'

class MyPaletteRoute extends Route {
  private readonly myPaletteController = new MyPaletteController()

  constructor () {
    super()
    this.setRoutes()
  }

  protected setRoutes (): void {
    this.router.post('/mypalette', authenticated,
      this.myPaletteController.upsertMyPalettes.bind(this.myPaletteController)
    )
  }
}

export default MyPaletteRoute
