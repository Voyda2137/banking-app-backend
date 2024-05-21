import {NextFunction, Request, Response, Router} from "express";
import passport from "passport";
import {getUserFromJwt, isUserService} from "../../Utils/UserUtils/GeneralUtils";
import {
    getAccountAndUpdateStatus,
    getAccountById, getTransactionsForAccount,
    getUserAccounts,
    getUserById,
    getUsers
} from "../../Utils/DatabaseUtils/DatabaseUtils";


const serviceRouter = Router();

serviceRouter.get("/ping", passport.authenticate("jwt", {session: false}), async (req, res, next) => {
    const startTime = Date.now();

    try {
        const authHeader: string | undefined = req.header('Authorization')
        const user = await getUserFromJwt(authHeader)
        if (!user) throw new Error('User not found')

        if (isUserService(user)) {
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            return res.status(200).json({success: true, message: 'pong', responseTime: responseTime})
        } else {
            throw new Error('You are not a service')
        }
    } catch (e) {
        next(e)
    }
})

serviceRouter.get("/transactionLogs/:id", passport.authenticate("jwt", {session: false}), async (req, res, next) => {
    try {
        const authHeader: string | undefined = req.header('Authorization')
        const user = await getUserFromJwt(authHeader)
        if (!user) throw new Error('User not found')

        if (isUserService(user)) {
            const logs = await getUserAccounts(req.params.id)
            return res.status(200).json({success: true, logs})
        } else {
            throw new Error('You are not a service')
        }
    } catch (e) {
        next(e)
    }
})

serviceRouter.put("/updateUserAccount/:id", passport.authenticate("jwt", {session: false}), async (req, res, next) => {
    try {
        const authHeader: string | undefined = req.header('Authorization')
        const user = await getUserFromJwt(authHeader)
        if (!user) throw new Error('User not found')

        if (isUserService(user)) {
            const account = await getAccountById(req.params.id)
            if (!account) throw new Error('Account not found')


            const updatedAccount = await getAccountAndUpdateStatus({accountId: account._id, status: req.body.status})

            if (updatedAccount) {
                return res.status(200).json({
                    success: true,
                    message: 'Successfully updated user account status',
                    account: updatedAccount
                })
            } else {
                throw new Error('Could not block user account')
            }
        } else {
            throw new Error('You are not a service')
        }
    } catch (e) {
        next(e)

    }
})

serviceRouter.get('/users', passport.authenticate("jwt", {session: false}), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader: string | undefined = req.header('Authorization')
        const user = await getUserFromJwt(authHeader)
        if (!user) throw new Error('User not found')

        if (user.isService) {
            const users = await getUsers(user._id.toString())
            return res.status(200).json({success: true, users})
        } else {
            throw new Error('You are not a service')
        }
    } catch (e) {
        next(e)
    }
})

serviceRouter.get("/userAccount/:id", passport.authenticate("jwt", {session: false}), async (req, res, next) => {
    try {
        const authHeader: string | undefined = req.header('Authorization')
        const user = await getUserFromJwt(authHeader)
        if (!user) throw new Error('User not found')

        if (isUserService(user)) {
            const account = await getTransactionsForAccount(req.params.id)
            if (!account) throw new Error('Account not found')

            return res.status(200).json({success: true, account})
        } else {
            throw new Error('You are not a service')
        }
    } catch (e) {
        next(e)
    }
})

serviceRouter.get("/user/:id", passport.authenticate("jwt", {session: false}), async (req, res, next) => {
  try {
    const authHeader: string | undefined = req.header('Authorization')
    const user = await getUserFromJwt(authHeader)
    if (!user) throw new Error('User not found')

    if (isUserService(user)) {
      const user = await getUserById(req.params.id)
      if (!user) throw new Error('User not found')

      return res.status(200).json({success: true, user})
    } else {
      throw new Error('You are not a service')
    }
  } catch (e) {
    next(e)
  }
})

export default serviceRouter;