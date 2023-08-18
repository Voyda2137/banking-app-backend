import mongoose, {Document} from "mongoose";
import dotenv from "dotenv";
import {UserModel, User} from "../../models/UserInterface";
import {BankAccount, BankAccountModel} from "../../models/AccountInterface";
import {generateBankAccountNumber} from "../AccountUtils/AccountUtils";
import moment from "moment"
import {Transaction, TransactionModel} from "../../models/TransactionInterface";
import {validateRequestProperties} from "../../Validators/Validators";
import {bankAccountStatusTypes} from "../../Constants/BankAccountStatusCodes";
const bcrypt = require('bcrypt')

dotenv.config()

export const connectToMongo = () => {
    const connectionString = process.env.MONGO_CONNECTION
    if(connectionString){
        mongoose.connect(connectionString).then(() => {
            console.log('Connected to mongo')
        })
    }
    else console.log('Cannot connect to mongo')
}
export const createUser = async (userData: User): Promise<User | null> => {
    try {
        const { login, email, password } = userData;
        const newUser = new UserModel(userData);
        const existingUser = await UserModel.findOne({ $or: [{ login }, { email }] });

        if (existingUser) {
            throw new Error('User with this login or email already exists')
        }

        const saltRounds = 10;

        newUser.password = await bcrypt.hash(password, saltRounds);

        return await newUser.save();

    } catch (e) {
        console.error('Could not create user', e)
        return null
    }
};
export const getUserByLogin = async (data: { login: string }): Promise<User | null> => {
    try {
        const user = await UserModel.findOne({ login: data.login });
        if (user) {
            return user
        } else {
            return null;
        }
    } catch (e) {
        throw new Error('Could not get user: ' + e);
    }
};
export const createBankAccount = async (accountData: BankAccount) : Promise<BankAccount | null> => {
    try {
        const account = {
            accountNumber: generateBankAccountNumber(),
            balance: 0,
            currency: accountData.currency,
            type: accountData.type,
            status: bankAccountStatusTypes.ACTIVE,
            createdAt: moment().valueOf(),
            updatedAt: moment().valueOf()
        }
        const newBankAccount = new BankAccountModel(account)
        return await newBankAccount.save()
    }
    catch (e){
        console.error('Could not create an account ', e)
        return null
    }
}
export const getUserAccounts = async (data: {userId: string}): Promise<BankAccount[]> => {
    try{
        const user = await UserModel.findOne({ _id: data.userId})
        const accounts: BankAccount[] = []
        if(user){
            if(user.bankAccounts.length > 0){
                for (const acc of user.bankAccounts) {
                    const account = await BankAccountModel.findOne({ acc });
                    if (account !== null) {
                        accounts.push(account);
                    }
                }
            }
        }
        return accounts
    }
    catch (e) {
        throw new Error('Could not get user accounts')
    }
}
export const addAccountToUser = async ({userId, bankAccId}: { userId: string, bankAccId: string }) => {
    try {
        return await UserModel.updateOne({_id: userId}, {$push: {bankAccounts: bankAccId}})
    }
    catch(e){
        return null
    }
}
export const createTransaction = async (transactionData: Transaction)=> {
    try {
        const newTransaction = new TransactionModel(transactionData)
        return await newTransaction.save()
    }
    catch (e) {
        if (e instanceof Error) {
            throw new Error('Could not create a transaction: ' + e.message);
        }
        else {
            throw new Error('Could not create a transaction');
        }
    }
}
export const getTransactionsForUser = async (data: {userId: string}) => {
    try {
        const transactions: Transaction[] = await TransactionModel.find({
            $or: [
                {sender: data.userId},
                {destinationAccount: data.userId}
            ]
        }).exec()
        if(!transactions) return 1
        else return transactions

    }
    catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            throw new Error('Could not get user transactions: ' + e.errors);
        }
        else {
            throw new Error('Could not get user transactions: ' + e);
        }
    }
}
