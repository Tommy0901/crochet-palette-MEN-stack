import UserController from '../controllers/user-controller'
import FavoriteBrandController from '../controllers/favorite-brand-controller'
import MyCollectionController from '../controllers/my-collection-controller'

import { authenticated } from '../middlewares/auth-handler'

import Route from './route'

class UserRoute extends Route {
  private readonly userController = new UserController()
  private readonly myCollectionController = new MyCollectionController()
  private readonly favoriteBrandController = new FavoriteBrandController()

  constructor () {
    super()
    this.setRoutes()
  }

  protected setRoutes (): void {
    this.router.post('/signup',
      this.userController.signUp.bind(this.userController)
    )
    this.router.post('/signin',
      this.userController.signIn.bind(this.userController)
    )
    this.router.post('/user/collections', authenticated,
      this.myCollectionController.addMyCollection.bind(this.myCollectionController)
    )
    this.router.get('/user/collections', authenticated,
      this.myCollectionController.showMyCollections.bind(this.myCollectionController)
    )
    this.router.put('/user/collection/:id', authenticated,
      this.myCollectionController.updateMyCollection.bind(this.myCollectionController)
    )
    this.router.delete('/user/collection/:id', authenticated,
      this.myCollectionController.removeMyCollection.bind(this.myCollectionController)
    )
    this.router.post('/user/brands', authenticated,
      this.favoriteBrandController.addMyFavorite.bind(this.favoriteBrandController)
    )
    this.router.get('/user/brands', authenticated,
      this.favoriteBrandController.showMyFavorites.bind(this.favoriteBrandController)
    )
    this.router.put('/user/brand/:id', authenticated,
      this.favoriteBrandController.updateMyFavorite.bind(this.favoriteBrandController)
    )
    this.router.delete('/user/brand/:id', authenticated,
      this.favoriteBrandController.removeMyFavorite.bind(this.favoriteBrandController)
    )
    this.router.post('/user/palettes', authenticated,
      this.userController.userCreatePalette.bind(this.userController)
    )
    this.router.get('/user/palettes', authenticated,
      this.userController.userReadPalette.bind(this.userController)
    )
    this.router.put('/user/palette/:id', authenticated,
      this.userController.userUpdatePalette.bind(this.userController)
    )
    this.router.delete('/user/palette/:id', authenticated,
      this.userController.userDeletePalette.bind(this.userController)
    )
  }
}

export default UserRoute
