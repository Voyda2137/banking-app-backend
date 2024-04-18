import {Transaction} from "../../models/TransactionInterface";
import {transactionTypes} from "../../Constants/TransactionTypes";
import moment from "moment";
import {getAccountById} from "../DatabaseUtils/DatabaseUtils";

interface GetTransactionsThatAreInterface {
    transactions: Transaction[]
    userAccountId: string
}

const isExpense = (transaction: Transaction, accountNumber: string) =>
    (transaction.transactionType === transactionTypes.TRANSFER && transaction.destinationAccount.toString() !== accountNumber) || transaction.transactionType === transactionTypes.WITHDRAWAL;

const isIncomes = (transaction: Transaction, accountNumber: string) =>
    (transaction.transactionType === transactionTypes.TRANSFER && transaction.destinationAccount.toString() === accountNumber) || transaction.transactionType === transactionTypes.DEPOSIT;


export const getTransactionsThatAreExpenses = async ({transactions, userAccountId}: GetTransactionsThatAreInterface) => {
    const userAccount = await getAccountById(userAccountId);
    if (!userAccount) throw new Error('Could not retrieve user account');

    return transactions.filter(transaction => isExpense(transaction, userAccount.accountNumber))
};

export const getTransactionsThatAreIncomes = async ({transactions, userAccountId}: GetTransactionsThatAreInterface) => {
    const userAccount = await getAccountById(userAccountId);
    if (!userAccount) throw new Error('Could not retrieve user account');
    console.log(transactions.filter(transaction => isIncomes(transaction, userAccount.accountNumber)))
    return transactions.filter(transaction => isIncomes(transaction, userAccount.accountNumber))
};

export const getTransactionsThatAreExpensesMonthly = async ({transactions, userAccountId}: GetTransactionsThatAreInterface) => {
    const expenses = await getTransactionsThatAreExpenses({transactions, userAccountId});
    const monthlyExpenses: { [key: number]: { expenses: number, transactions: Transaction[] } } = {};
    const twelveMonthsAgo = moment().subtract(11, 'months');

    expenses.forEach((transaction) => {
        const transactionDate = moment(transaction.date);
        if (transactionDate.isSameOrAfter(twelveMonthsAgo)) {
            const monthIndex = 12 - moment().diff(transactionDate, 'months') - 1;
            monthlyExpenses[monthIndex] = monthlyExpenses[monthIndex] || { expenses: 0, transactions: [] };
            monthlyExpenses[monthIndex].expenses += transaction.amount;
            monthlyExpenses[monthIndex].transactions.push(transaction);
        }
    })

    return Array.from({length: 12}, (_, i) => {
        const monthIndex = (moment().month() - i + 10) % 12;
        return {
            month: monthIndex,
            ...monthlyExpenses[monthIndex]
        }
    }).sort((a, b) => a.month - b.month);
}

export const getTransactionsThatAreIncomesMonthly = async ({transactions, userAccountId}: GetTransactionsThatAreInterface) => {
    const incomes = await getTransactionsThatAreIncomes({transactions, userAccountId});
    const monthlyIncomes: { [key: number]: { incomes: number, transactions: Transaction[] } } = {};
    const twelveMonthsAgo = moment().subtract(11, 'months');

    incomes.forEach((transaction) => {
        const transactionDate = moment(transaction.date);
        if (transactionDate.isSameOrAfter(twelveMonthsAgo)) {
            const monthIndex = 12 - moment().diff(transactionDate, 'months') - 1;
            monthlyIncomes[monthIndex] = monthlyIncomes[monthIndex] || { incomes: 0, transactions: [] };
            monthlyIncomes[monthIndex].incomes += transaction.amount;
            monthlyIncomes[monthIndex].transactions.push(transaction);
        }
    })

    return Array.from({length: 12}, (_, i) => {
        const monthIndex = (moment().month() - i + 10) % 12;
        return {
            month: monthIndex,
            ...monthlyIncomes[monthIndex]
        }
    }).sort((a, b) => a.month - b.month);
}

export const getTransactionsThatAreExpensesYearly = async ({transactions, userAccountId}: GetTransactionsThatAreInterface) => {
    const expenses = await getTransactionsThatAreExpenses({transactions, userAccountId});
    const yearlyExpenses: { [key: number]: { expenses: number, transactions: Transaction[] } } = {};
    const currentYear = moment().year();

    expenses.forEach((transaction) => {
        const transactionDate = moment(transaction.date);
        const yearIndex = currentYear - transactionDate.year();
        yearlyExpenses[yearIndex] = yearlyExpenses[yearIndex] || { expenses: 0, transactions: [] };
        yearlyExpenses[yearIndex].expenses += transaction.amount;
        yearlyExpenses[yearIndex].transactions.push(transaction);
    })

    return Array.from({length: currentYear - 2010}, (_, i) => {
        return {
            year: currentYear - i,
            ...yearlyExpenses[i]
        }
    }).sort((a, b) => a.year - b.year);
}

export const getTransactionsThatAreIncomesYearly = async ({transactions, userAccountId}: GetTransactionsThatAreInterface) => {
    const incomes = await getTransactionsThatAreIncomes({transactions, userAccountId});
    const yearlyIncomes: { [key: number]: { incomes: number, transactions: Transaction[] } } = {};
    const currentYear = moment().year();

    incomes.forEach((transaction) => {
        const transactionDate = moment(transaction.date);
        const yearIndex = currentYear - transactionDate.year();
        yearlyIncomes[yearIndex] = yearlyIncomes[yearIndex] || { incomes: 0, transactions: [] };
        yearlyIncomes[yearIndex].incomes += transaction.amount;
        yearlyIncomes[yearIndex].transactions.push(transaction);
    })

    return Array.from({length: currentYear - 2010}, (_, i) => {
        return {
            year: currentYear - i,
            ...yearlyIncomes[i]
        }
    }).sort((a, b) => a.year - b.year);
}

export const getPercentageOfExpensesToIncomes = async ({transactions, userAccountId}: GetTransactionsThatAreInterface) => {

    const expenses = await getTransactionsThatAreExpenses({transactions, userAccountId});
    const incomes = await getTransactionsThatAreIncomes({transactions, userAccountId});

    const expensesAmount = expenses.reduce((acc: number, transaction: Transaction) => acc + transaction.amount, 0)
    const incomesAmount = incomes.reduce((acc: number, transaction: Transaction) => acc + transaction.amount, 0)

    return Number(((expensesAmount / incomesAmount) * 100).toFixed(2))
}