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
    this.router.post('/mypalettes', authenticated,
      this.myPaletteController.addMyPalette.bind(this.myPaletteController)
    )
    this.router.get('/mypalettes', authenticated,
      this.myPaletteController.getMyPalettes.bind(this.myPaletteController)
    )
    this.router.put('/mypalette/:id', authenticated,
      this.myPaletteController.putMyPalette.bind(this.myPaletteController)
    )
    this.router.delete('/mypalette/:id', authenticated,
      this.myPaletteController.deleteMyPalette.bind(this.myPaletteController)
    )
  }
}

export default MyPaletteRoute
