import {Router, Request, Response, NextFunction} from "express";
import {addAccountToUser, createBankAccount, getUserAccounts} from "../../Utils/DatabaseUtils/DatabaseUtils";
import passport from "../../Utils/UserUtils/Authorizer"
import {validateRequestProperties} from "../../Validators/Validators";

const bankAccountRouter = Router()

bankAccountRouter.post('/create', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const expectedProperties = ['currency', 'type']
        const validateRequest = await validateRequestProperties(req.body, expectedProperties)

        if(!validateRequest.success){
            throw new Error(validateRequest.message)
        }
        createBankAccount(req.body).then(response => {
            if(response){
                addAccountToUser({userId: req.body.userId, bankAccId: response._id}).then(() => {
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
        const expectedProperties = ['userId']
        const validateRequest = await validateRequestProperties(req.body, expectedProperties)

        if(!validateRequest.success){
            throw new Error(validateRequest.message)
        }

        getUserAccounts(req.body).then(response => {
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
