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
import {extractLoginFromJwt, getUserFromJwt} from "../UserUtils/GeneralUtils";
import {languages} from "../../Constants/Languages";

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
            if(name && user.name !== name) modifiedFields.name = name
            if(surname && user.surname !== surname) modifiedFields.surname = surname
            if(email && user.email !== email) modifiedFields.email = email
            if(password && user.password !== password) modifiedFields.password = password
            if(phoneNumber && user.phoneNumber !== phoneNumber) modifiedFields.phoneNumber = phoneNumber
            if(address && user.address !== address) modifiedFields.address = address
            await UserModel.updateOne({_id: user._id}, {$set: modifiedFields})
            return 1
        }
        catch (e) {
            throw new Error('Error updating user data')
        }
    }
}
/**
 *
 * @param token - service user's jwt
 * @param login - user to be made a service user
 * @returns if the function was successful returns 1 else returns 0
 */
export const changeUserToService = async ({token, login}: {token: string, login: string}) => {
    const serviceUser = await getUserFromJwt(token)
    if(serviceUser?.isService){
       const futureService = await getUserByLogin(login)
        if(futureService){
            await UserModel.updateOne({_id: futureService._id}, {isService: true})
            return 1
        }
    }
    return 0
}
export const changeSettings = async ({userId, locale, mainAccount}: {userId: string, locale?: languages, mainAccount?: string}) => {
    const user = await getUserById(userId)
    if(!locale && !mainAccount) return null
    return UserModel.updateOne({_id: userId}, {
        settings: {
            locale: locale ? locale : user?.settings.locale,
            mainAccount: mainAccount ? mainAccount : user?.settings.mainAccount
        }})
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
        return acc.toString() === accId?._id.toString()
    })
    return !!userHasAcc;
}
export const getAccountById = async (accountId: string) => {
    try {
        const account: BankAccount | null = await BankAccountModel.findById(accountId).exec()
        if(account) return account
        else return null
    }
    catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            throw new Error('Could not get account: ' + e.errors);
        }
        else {
            throw new Error('Could not get account: ' + e);
        }
    }
}
export const getAccountAndDelete = async (accountId: string) => {
    try {
        return await BankAccountModel.findByIdAndDelete(accountId).exec();
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            throw new Error('Could not get account: ' + e.errors);
        } else {
            throw new Error('Could not get account: ' + e);
        }
    }
}
// transaction

export const createTransaction = async (transactionData: Partial<Transaction>)=> {
    try {
        switch(transactionData.transactionType){
            case transactionTypes.TRANSFER:
                if(transactionData.sourceAccount && transactionData.amount){
                    const senderAcc = await getAccByNumber(transactionData.sourceAccount.toString())
                    if(senderAcc){
                        if(senderAcc?.balance < transactionData.amount) return 0
                    }
                    await BankAccountModel.findOneAndUpdate(
                        {accountNumber: transactionData.sourceAccount},
                        {$inc: {balance: -transactionData.amount}}
                    )
                    await BankAccountModel.findOneAndUpdate(
                        {accountNumber: transactionData.destinationAccount},
                        {$inc: {balance: transactionData.amount}}
                    )
                }
                break
            case transactionTypes.DEPOSIT:
                if(transactionData.sourceAccount && transactionData.amount){
                    await BankAccountModel.findOneAndUpdate(
                        {accountNumber: transactionData.sourceAccount},
                        {$inc: {balance: transactionData.amount}}
                    )
                }
                break
            case transactionTypes.WITHDRAWAL:
                if(transactionData.sourceAccount && transactionData.amount) {
                    await BankAccountModel.findOneAndUpdate(
                        {accountNumber: transactionData.sourceAccount},
                        {$inc: {balance: -transactionData.amount}}
                    )
                }
                break
        }
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
                {receiver: userId}
            ]
        }).sort({_id: -1}).exec()
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
export const getTransactionsForAccount = async (accountId: string) => {
    try {
        const account = await getAccountById(accountId);

        const transactions: Transaction[] = await TransactionModel.find({
            $or: [
                {sourceAccount: account?.accountNumber},
                {destinationAccount: account?.accountNumber}
            ]
        }).sort({_id: -1}).exec()
        if(!transactions) return 1
        else return transactions
    }
    catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            throw new Error('Could not get account transactions: ' + e.errors);
        }
        else {
            throw new Error('Could not get account transactions: ' + e);
        }
    }
}

