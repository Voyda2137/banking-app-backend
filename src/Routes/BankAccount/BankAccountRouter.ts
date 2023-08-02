import {Router, Request, Response} from "express";
import {createBankAccount, getUserAccounts} from "../../DatabaseUtils/DatabaseUtils";
import passport from "../../UserUtils/Authorizer"

const bankAccountRouter = Router()

bankAccountRouter.post('/create', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    createBankAccount(req.body).then(response => {
        if(response === null){
            res.status(500).json({ success: false, message: 'Account creation failure' })
        }
        else{
            res.status(200).json({success: true, message: 'Successfully created the bank account'})
        }
    })
})
bankAccountRouter.get('/accounts', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    getUserAccounts(req.body).then(response => {
        if(response === null){
            res.status(500).json({success: false, message: 'Could not get user accounts'})
        }
        else{
            res.status(200).json({success: true, message: 'Successfully retrieved user accounts', accounts: response})
        }
    })
})
export default bankAccountRouter
