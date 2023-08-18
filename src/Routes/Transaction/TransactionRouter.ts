import {NextFunction, Request, Response, Router} from "express";
import passport from "../../Utils/UserUtils/Authorizer";
import {validateRequestProperties} from "../../Validators/Validators";
import {createTransaction, getTransactionsForUser} from "../../Utils/DatabaseUtils/DatabaseUtils";
import moment from "moment/moment";


const transactionRouter = Router()

transactionRouter.post('/create', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
    try {
        let expectedProperties
        if(req.body.isRepeating){
            expectedProperties = [
                'transactionType',
                'amount',
                'currency',
                'sender',
                'receiver',
                'sourceAccount',
                'destinationAccount',
                'title',
                'repeatsEvery'
            ]
        }
        else {
            expectedProperties = [
                'transactionType',
                'amount',
                'currency',
                'sender',
                'receiver',
                'sourceAccount',
                'destinationAccount',
                'title'
            ]
        }
        const validateRequest = await validateRequestProperties(req.body, expectedProperties)

        if(!validateRequest.success){
            throw new Error(validateRequest.message)
        }
        if (moment(req.body.date).isBefore(moment())){
            throw new Error('Transaction cannot be in the past')
        }

        createTransaction(req.body).then(val => {
            if(val)
                return res.status(200).json({ success: true, message: 'Successfully created the transaction' })
        })
    }
    catch (e) {
        next(e)
    }
})
transactionRouter.get('/transactions', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const expectedProperties = ['userId']
        const validateRequest = await validateRequestProperties(req.body, expectedProperties)

        if(!validateRequest.success){
            throw new Error(validateRequest.message)
        }
        getTransactionsForUser(req.body).then(val => {
            if(val === 1){
                return res.status(200).json({success: true, message: 'User has no transactions'})
            }
            else {
                return res.status(200).json({success: true, message: 'Successfully retrieved user transactions', transactions: [val]})
            }
        })
    }
    catch (e) {
        next(e)
    }
})

export default transactionRouter