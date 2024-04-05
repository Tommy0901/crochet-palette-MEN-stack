import { type Request, type Response, type NextFunction } from 'express'
import passport from '../config/passport'
import { errorMsg } from '../helpers/message-helper'

export function authenticated (req: Request, res: Response, next: NextFunction): void {
  passport.authenticate('jwt',
    (err: { status: number, message: string }, data: Express.User | null) => {
      if (err != null || data == null || data === false) return errorMsg(res, 401, 'unauthorized.')
      req.user = data
      next()
    }
  )(req, res, next)
}
