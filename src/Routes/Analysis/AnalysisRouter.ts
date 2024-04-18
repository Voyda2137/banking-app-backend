import {NextFunction, Request, Response, Router} from "express";
import {getUserFromJwt} from "../../Utils/UserUtils/GeneralUtils";
import {getTransactionsForAccount, getUserActualAccount} from "../../Utils/DatabaseUtils/DatabaseUtils";
import {
    getPercentageOfExpensesToIncomes,
    getTransactionsThatAreExpenses,
    getTransactionsThatAreExpensesMonthly,
    getTransactionsThatAreExpensesYearly,
    getTransactionsThatAreIncomes,
    getTransactionsThatAreIncomesMonthly,
    getTransactionsThatAreIncomesYearly
} from "../../Utils/AnalysisUtils/AnalysisUtils";

const analysisRouter = Router()


analysisRouter.get('/expenses/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUserFromJwt(req.header('Authorization'))
        if (!user) throw new Error('Could not verify user')


        const transactions = await getTransactionsForAccount(req.params.id)
        if (transactions === 1) return res.status(200).json({success: true, message: 'User has no transactions'})

        const expenses = await getTransactionsThatAreExpenses({transactions, userAccountId: req.params.id});

        return res.status(200).json({
            success: true,
            message: 'Successfully retrieved user expenses',
            expenses
        })
    } catch (e) {
        next(e)
    }
})

analysisRouter.get('/expensesMonthly/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUserFromJwt(req.header('Authorization'))
        if (!user) throw new Error('Could not verify user')

        const userAccount = await getUserActualAccount(user._id.toString())
        if (!userAccount) throw new Error('Could not retrieve user main account')

        const transactions = await getTransactionsForAccount(req.params.id)
        if (transactions === 1) return res.status(200).json({success: true, message: 'User has no transactions'})

        const expensesMonthly = await getTransactionsThatAreExpensesMonthly({transactions, userAccountId: req.params.id});
        // const expenses = getTransactionsThatAreExpenses({transactions, userAccountId: req.params.id);
        // const incomes = getTransactionsThatAreIncomes({transactions, userAccountId: req.params.id);
        // const monthlyExpenses = getTransactionsThatAreExpensesMonthly({transactions, userAccountId: req.params.id);
        //
        // const expensesAmount = expenses.reduce((acc: number, transaction: Transaction) => acc + transaction.amount, 0)
        // const incomesAmount = incomes.reduce((acc: number, transaction: Transaction) => acc + transaction.amount, 0)
        // const percentageOfExpensesToIncomes = Number(((expensesAmount / incomesAmount) * 100).toFixed(2))

        return res.status(200).json({
            success: true,
            message: 'Successfully retrieved user expenses',
            expenses: expensesMonthly
        })
    } catch (e) {
        next(e)
    }
})

analysisRouter.get('/expensesYearly/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUserFromJwt(req.header('Authorization'))
        if (!user) throw new Error('Could not verify user')

        const userAccount = await getUserActualAccount(user._id.toString())
        if (!userAccount) throw new Error('Could not retrieve user main account')

        const transactions = await getTransactionsForAccount(req.params.id)
        if (transactions === 1) return res.status(200).json({success: true, message: 'User has no transactions'})

        const expensesYearly = await getTransactionsThatAreExpensesYearly({transactions, userAccountId: req.params.id});

        return res.status(200).json({
            success: true,
            message: 'Successfully retrieved user expenses',
            expenses: expensesYearly
        })
    } catch (e) {
        next(e)
    }
})


analysisRouter.get('/incomes/:id', async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params
    try {
        const user = await getUserFromJwt(req.header('Authorization'))
        if (!user) throw new Error('Could not verify user')

        const transactions = await getTransactionsForAccount(id)
        if (transactions === 1) return res.status(200).json({success: true, message: 'User has no transactions'})
        console.log(id)
        const incomes = await getTransactionsThatAreIncomes({transactions, userAccountId: id});
        return res.status(200).json({
            success: true,
            message: 'Successfully retrieved user incomes',
            incomes
        })
    } catch (e) {
        next(e)
    }
})

analysisRouter.get('/incomesMonthly/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUserFromJwt(req.header('Authorization'))
        if (!user) throw new Error('Could not verify user')

        const userAccount = await getUserActualAccount(user._id.toString())
        if (!userAccount) throw new Error('Could not retrieve user main account')

        const transactions = await getTransactionsForAccount(req.params.id)
        if (transactions === 1) return res.status(200).json({success: true, message: 'User has no transactions'})

        const incomesMonthly = await getTransactionsThatAreIncomesMonthly({transactions, userAccountId: req.params.id});

        return res.status(200).json({
            success: true,
            message: 'Successfully retrieved user expenses',
            incomes: incomesMonthly
        })
    } catch (e) {
        next(e)
    }
})

analysisRouter.get('/incomesYearly/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUserFromJwt(req.header('Authorization'))
        if (!user) throw new Error('Could not verify user')

        const userAccount = await getUserActualAccount(user._id.toString())
        if (!userAccount) throw new Error('Could not retrieve user main account')

        const transactions = await getTransactionsForAccount(req.params.id)
        if (transactions === 1) return res.status(200).json({success: true, message: 'User has no transactions'})

        const incomesYearly = await getTransactionsThatAreIncomesYearly({transactions, userAccountId: req.params.id});

        return res.status(200).json({
            success: true,
            message: 'Successfully retrieved user expenses',
            incomes: incomesYearly
        })
    } catch (e) {
        next(e)
    }
})

analysisRouter.get('/expensesVsIncomes/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUserFromJwt(req.header('Authorization'))
        if (!user) throw new Error('Could not verify user')

        const userAccount = await getUserActualAccount(user._id.toString())
        if (!userAccount) throw new Error('Could not retrieve user main account')

        const transactions = await getTransactionsForAccount(req.params.id)
        if (transactions === 1) return res.status(200).json({success: true, message: 'User has no transactions'})

        const percentageOfExpensesToIncomes = await getPercentageOfExpensesToIncomes({transactions, userAccountId: req.params.id})
        return res.status(200).json({
            success: true,
            message: 'Successfully retrieved user expenses',
            percentageOfExpensesToIncomes
        })
    } catch (e) {
        next(e)
    }
})
export default analysisRouter