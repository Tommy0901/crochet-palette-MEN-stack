import BrandPaletteController from '../controllers/brand-palette-controller'
import Route from './route'

class BrandPaletteRoute extends Route {
  private readonly brandPaletteController = new BrandPaletteController()

  constructor () {
    super()
    this.setRoutes()
  }

  protected setRoutes (): void {
    this.router.post('/brands',
      this.brandPaletteController.postBrand.bind(this.brandPaletteController)
    )
    this.router.get('/brands',
      this.brandPaletteController.getBrands.bind(this.brandPaletteController)
    )
    this.router.put('/brand/:id',
      this.brandPaletteController.putBrand.bind(this.brandPaletteController)
    )
    this.router.delete('/brand/:id',
      this.brandPaletteController.deleteBrand.bind(this.brandPaletteController)
    )
  }
}

export default BrandPaletteRoute
