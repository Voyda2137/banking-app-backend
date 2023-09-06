import mongoose from "mongoose";
import dotenv from "dotenv";
import {UserModel, User} from "../../models/UserInterface";
import {BankAccount, BankAccountModel} from "../../models/AccountInterface";
import {generateBankAccountNumber} from "../AccountUtils/AccountUtils";
import moment from "moment"
import {Transaction, TransactionModel} from "../../models/TransactionInterface";
import {bankAccountStatusTypes} from "../../Constants/BankAccountStatusCodes";
import {transactionTypes} from "../../Constants/TransactionTypes";
import {currencyTypes} from "../../Constants/CurrencyTypes";
import {getUserFromJwt} from "../UserUtils/GeneralUtils";

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
// user

export const createUser = async (userData: User): Promise<User | null> => {
        const { login, email, password } = userData;
        const newUser = new UserModel(userData);
        const existingUser = await UserModel.findOne({ $or: [{ login }, { email }] });

        if (existingUser) {
            return null
        }

        const saltRounds = 10;

        newUser.password = await bcrypt.hash(password, saltRounds);

        return await newUser.save();

};
export const getUserByLogin = async (login: string): Promise<User | null> => {
    try {
        const user = await UserModel.findOne({login: login});
        if (user) {
            return user
        } else {
            return null;
        }
    } catch (e) {
        throw new Error('Could not get user: ' + e);
    }
};
export const getUserById = async (userId: string): Promise<User | null> => {
    try {
        const user = await UserModel.findById(userId);
        if (user) {
            return user
        } else {
            return null;
        }
    } catch (e) {
        throw new Error('Could not get user: ' + e);
    }
};
export const editUser = async (
    {
        token,
        name,
        surname,
        email,
        password,
        phoneNumber,
        address
    }: {
        token: string,
        name: string,
        surname: string,
        email: string,
        password: string,
        phoneNumber: number,
        address: string
    }
) => {
    const user = await getUserFromJwt(token)
    if(user){
        try{
            const modifiedFields: {[key: string]: any} = {}
            if(name && user.name === name) return 1
            if(surname && user.surname === surname) return 2
            if(email && user.email === email) return 3
            if(password && user.password === password) return 4
            if(phoneNumber && user.phoneNumber === phoneNumber) return 5
            if(address && user.address === address) return 6
            if(name) modifiedFields.name = name
            if(surname) modifiedFields.surname = surname
            if(email) modifiedFields.email = email
            if(password) modifiedFields.password = password
            if(phoneNumber) modifiedFields.phoneNumber = phoneNumber
            if(address) modifiedFields.address = address
            await UserModel.updateOne({_id: user._id}, {$set: modifiedFields})
            return 0
        }
        catch (e) {
            throw new Error('Error updating user data')
        }
    }
}
// bank account

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
export const getAccByNumber = async (accNumber: string): Promise<BankAccount | null> => {
    try {
        const acc = await BankAccountModel.findOne({accountNumber: accNumber});
        if (acc) {
            return acc
        } else {
            return null;
        }
    } catch (e) {
        throw new Error('Could not get the account: ' + e);
    }
};
export const getUserAccounts = async (userId: string): Promise<BankAccount[]> => {
    try{
        const user = await UserModel.findById(userId)
        const accounts: BankAccount[] = []
        if(user){
            if(user.bankAccounts.length > 0){
                for (const acc of user.bankAccounts) {
                    const account = await BankAccountModel.findById(acc);
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
export const checkIfAccountBelongsToUser = async ({userId, bankAccNumber}: {userId: string, bankAccNumber: string}) => {
    const user = await getUserById(userId.toString())
    const accId = await getAccByNumber(bankAccNumber)
    const userHasAcc =  user?.bankAccounts.some(acc => {
        console.log('konto', acc.toString())
        return acc.toString() === accId?._id.toString()
    })
    return !!userHasAcc;
}

// transaction

export const createTransaction = async (transactionData: {
    transactionType: transactionTypes;
    amount: number;
    receiver: string;
    sourceAccount: string;
    sender: string;
    description: string;
    currency: currencyTypes;
    title: string;
    destinationAccount: string,
    isRepeating: boolean
})=> {
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
export const getTransactionsForUser = async (userId: string) => {
    try {
        const transactions: Transaction[] = await TransactionModel.find({
            $or: [
                {sender: userId},
                {destinationAccount: userId}
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
