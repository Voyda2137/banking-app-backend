import {NextFunction, Request, Response, Router} from "express";
import passport from "../../Utils/UserUtils/Authorizer";
import {validateRequestProperties} from "../../Validators/Validators";
import {
    checkIfAccountBelongsToUser,
    createTransaction,
    getTransactionsForUser,
} from "../../Utils/DatabaseUtils/DatabaseUtils";
import moment from "moment/moment";
import {getUserFromJwt} from "../../Utils/UserUtils/GeneralUtils";


const transactionRouter = Router()

transactionRouter.post('/create', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader: string | undefined = req.header('Authorization')

        const user = await getUserFromJwt(authHeader)
        if(!user){
            throw new Error('Could not verify user')
        }

        let expectedProperties
        if(req.body.isRepeating){
            expectedProperties = [
                'transactionType',
                'amount',
                'currency',
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

        if (moment(req.body.date).isBefore(moment().startOf('d'))){
            throw new Error('Transaction cannot be in the past')
        }

        const accBelongsToUser = await checkIfAccountBelongsToUser({userId: user._id.toString(), bankAccNumber: req.body.sourceAccount})
        if(!accBelongsToUser){
            throw new Error('Incorrect account')
        }
        const transaction = {
            transactionType: req.body.transactionType,
            amount: req.body.amount,
            currency: req.body.currency,
            sender: user._id.toString(),
            receiver: req.body.receiver,
            sourceAccount: req.body.sourceAccount,
            destinationAccount: req.body.destinationAccount,
            title: req.body.title,
            description: ""
        }
        if(req.body.description) transaction.description = req.body.description
        if(req.body.sourceAccount !== req.body.destinationAccount)
        createTransaction(transaction).then(val => {
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
        const authHeader: string | undefined = req.header('Authorization')

        const user = await getUserFromJwt(authHeader)
        if(!user){
            throw new Error('Could not verify user')
        }
        getTransactionsForUser(user._id).then(val => {
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