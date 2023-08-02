import {Router, Request, Response} from "express";
import {addAccountToUser, createBankAccount, getUserAccounts} from "../../DatabaseUtils/DatabaseUtils";
import passport from "../../UserUtils/Authorizer"

const bankAccountRouter = Router()

bankAccountRouter.post('/create', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    try {
        createBankAccount(req.body).then(response => {
            if(response === null){
                return res.status(500).json({ success: false, message: 'Account creation failure' })
            }
            else{
                addAccountToUser(req.body.userId, response._id.toString()).then(() => {
                    return res.status(200).json({success: true, message: 'Successfully created the bank account'})
                })
            }
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, message: 'Something went wrong' });
    }
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
