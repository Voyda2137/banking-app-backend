import {Router, Request, Response, NextFunction} from "express";
import {addAccountToUser, createBankAccount, getUserAccounts} from "../../Utils/DatabaseUtils/DatabaseUtils";
import passport from "../../Utils/UserUtils/Authorizer"
import {getUserFromJwt} from "../../Utils/UserUtils/GeneralUtils";
import {createBankAccountValidator} from "../../Validators/AccountValidator";
import {validationResult} from "express-validator";

const bankAccountRouter = Router()

bankAccountRouter.post('/create', createBankAccountValidator, passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const authHeader: string | undefined = req.header('Authorization')

        const user = await getUserFromJwt(authHeader)
        if(!user){
            throw new Error('Could not verify user')
        }

        createBankAccount(req.body).then(response => {
            if(response){
                addAccountToUser({userId: user._id, bankAccId: response._id}).then(() => {
                    return res.status(200).json({success: true, message: 'Successfully created the bank account'})
                })
            }
            else {
                throw new Error('Could not create user account')
            }
        })
    }
    catch (e) {
        next(e)
    }
})
bankAccountRouter.get('/accounts', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader: string | undefined = req.header('Authorization')

        const user = await getUserFromJwt(authHeader)
        if(!user){
            throw new Error('Could not verify user')
        }

        getUserAccounts(user._id).then(response => {
            if(response){
                res.status(200).json({success: true, message: 'Successfully retrieved user accounts', accounts: response})
            }
        })
    }
    catch (e) {
        next(e)
    }

})
export default bankAccountRouter
