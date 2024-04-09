import {NextFunction, Request, Response, Router} from "express";
import passport from "../../Utils/UserUtils/Authorizer";
import {
    checkIfAccountBelongsToUser,
    createTransaction,
    getAccByNumber,
    getTransactionsForAccount,
    getTransactionsForUser,
} from "../../Utils/DatabaseUtils/DatabaseUtils";
import moment from "moment/moment";
import {getUserFromJwt} from "../../Utils/UserUtils/GeneralUtils";
import {createTransactionValidator} from "../../Validators/TransactionValidator";
import {validationResult} from "express-validator";
import {repeatsEveryTypes} from "../../Constants/RepeatsEveryTypes";
import {transactionTypes} from "../../Constants/TransactionTypes";
import {Transaction} from "../../models/TransactionInterface";


const transactionRouter = Router()

transactionRouter.post('/create', createTransactionValidator, passport.authenticate('jwt', {session: false}), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success: false, errors: errors.array()});
        }

        const authHeader: string | undefined = req.header('Authorization')

        const user = await getUserFromJwt(authHeader)
        if (!user) {
            throw new Error('Could not verify user')
        }
        if (req.body.amount <= 0) {
            throw new Error('Amount must be bigger than 0')
        }
        const accBelongsToUser = await checkIfAccountBelongsToUser({
            userId: user._id.toString(),
            bankAccNumber: req.body.sourceAccount
        })
        if (!accBelongsToUser) {
            throw new Error('Incorrect account')
        }
        let transaction: Partial<Transaction> | undefined
        switch (req.body.transactionType) {
            case transactionTypes.TRANSFER:
                const receiverAccount = await getAccByNumber(req.body.destinationAccount)
                if (!receiverAccount) {
                    throw new Error('Could not get the account')
                }
                const transferTransaction = {
                    transactionType: transactionTypes.TRANSFER,
                    amount: req.body.amount,
                    currency: req.body.currency,
                    sender: user._id.toString(),
                    senderInfo: user.name + " " + user.surname,
                    receiver: receiverAccount._id.toString(),
                    receiverInfo: req.body.receiverInfo,
                    date: +moment(),
                    createdAt: +moment(),
                    sourceAccount: req.body.sourceAccount,
                    destinationAccount: req.body.destinationAccount,
                    title: req.body.title,
                    description: "",
                    isRepeating: false,
                    repeatsEvery: {
                        interval: null,
                        unit: repeatsEveryTypes.NOTREPEATING
                    }
                }
                if (req.body.description) transferTransaction.description = req.body.description
                if (req.body.date) transferTransaction.date = req.body.date
                if (req.body.isRepeating === true) {
                    transferTransaction.isRepeating = req.body.isRepeating
                    transferTransaction.repeatsEvery.interval = req.body.repeatsEvery.interval
                    transferTransaction.repeatsEvery.unit = req.body.repeatsEvery.unit
                }
                if (req.body.sourceAccount === req.body.destinationAccount) throw new Error('Accounts must differ')
                transaction = transferTransaction
                break
            case transactionTypes.DEPOSIT:
                let depositTransaction = {
                    transactionType: transactionTypes.DEPOSIT,
                    amount: req.body.amount,
                    currency: req.body.currency,
                    date: +moment(),
                    createdAt: +moment(),
                    sender: user._id.toString(),
                    sourceAccount: req.body.sourceAccount,
                }
                transaction = depositTransaction
                break
            case transactionTypes.WITHDRAWAL:
                let withdrawalTransaction = {
                    transactionType: transactionTypes.WITHDRAWAL,
                    amount: req.body.amount,
                    currency: req.body.currency,
                    date: +moment(),
                    createdAt: +moment(),
                    sender: user._id.toString(),
                    sourceAccount: req.body.sourceAccount,
                }
                transaction = withdrawalTransaction
                break
        }
        if (transaction) {
            createTransaction(transaction).then(val => {
                if (val)
                    return res.status(200).json({success: true, message: 'Successfully created the transaction'})
            })
        }
    } catch (e) {
        next(e)
    }
})
transactionRouter.get('/transactions', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader: string | undefined = req.header('Authorization')

        const user = await getUserFromJwt(authHeader)
        if (!user) {
            throw new Error('Could not verify user')
        }
        getTransactionsForUser(user._id.toString()).then(val => {
            if (val === 1) {
                return res.status(200).json({success: true, message: 'User has no transactions'})
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Successfully retrieved user transactions',
                    transactions: val
                })
            }
        })
    } catch (e) {
        next(e)
    }
})

transactionRouter.get('/transactions/:id', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader: string | undefined = req.header('Authorization')
        const user = await getUserFromJwt(authHeader)
        if (!user) {
            throw new Error('Could not verify user')
        }
        getTransactionsForAccount(req.params.id).then(val => {
            if (val === 1) {
                return res.status(200).json({success: true, message: 'Account has no transactions'})
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Successfully retrieved account transactions',
                    transactions: val
                })
            }
        })
    } catch (e) {
        next(e);
    }
})

export default transactionRouter