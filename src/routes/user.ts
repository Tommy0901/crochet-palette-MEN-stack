import UserController from '../controllers/user-controller'
import { authenticated } from '../middlewares/auth-handler'
import Route from './route'

class UserRoute extends Route {
  private readonly userController = new UserController()

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
