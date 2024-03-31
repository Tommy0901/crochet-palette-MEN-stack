import PaletteController from '../controllers/palette-controller'
import Route from './route'

class PaletteRoute extends Route {
  private readonly paletteController = new PaletteController()

  constructor () {
    super()
    this.setRoutes()
  }

  protected setRoutes (): void {
    this.router.get('/palettes',
      this.paletteController.getPalettes.bind(this.paletteController)
    )
  }
}

export default PaletteRoute
