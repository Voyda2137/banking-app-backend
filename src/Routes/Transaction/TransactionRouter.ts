import {Request, Response, Router} from "express";
import passport from "../../Utils/UserUtils/Authorizer";
import {validateRequestProperties} from "../../Validators/Validators";
import {createTransaction, getTransactionsForUser} from "../../Utils/DatabaseUtils/DatabaseUtils";


const transactionRouter = Router()

transactionRouter.post('/create', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    try {
        const expectedProperties = [
            'transactionType',
            'amount',
            'currency',
            'sender',
            'receiver',
            'sourceAccount',
            'destinationAccount',
            'title'
        ]
        const validateRequest = await validateRequestProperties(req.body, expectedProperties)

        if(!validateRequest.success){
            return res.status(500).json(validateRequest)
        }

        createTransaction(req.body).then(val => {
            if(val === null){
                return res.status(500).json({ success: false, message: 'Could not create the transaction' })
            }
            else {
                return res.status(200).json({ success: true, message: 'Successfully created the transaction' })
            }
        })
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: 'An error occurred while processing the request' });
    }
})
transactionRouter.get('/transactions', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    try {
        getTransactionsForUser(req.body).then(val => {
            if(!val){
                return res.status(500).json({success: true, message: 'Could not get user transactions'})
            }
            else if(val === 1){
                return res.status(200).json({success: true, message: 'User has no transactions'})
            }
            else {
                return res.status(200).json({success: true, message: 'Successfully retrieved user transactions', transactions: [val]})
            }
        })
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: 'An error occurred while processing the request' });
    }
})

export default transactionRouter