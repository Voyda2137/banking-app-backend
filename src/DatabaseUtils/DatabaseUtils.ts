import mongoose, {Document} from "mongoose";
import dotenv from "dotenv";
import {UserModel, User} from "../models/UserInterface";
import {BankAccount, BankAccountModel} from "../models/AccountInterface";
import {generateBankAccountNumber} from "../AccountUtils/AccountUtils";
import moment from "moment"
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
            return null;
        }

        const saltRounds = 10;

        newUser.password = await bcrypt.hash(password, saltRounds);

        return await newUser.save();

    } catch (e) {
        console.log(e)
        return null;
    }
};
export const getUserByLogin = async (login: string): Promise<User | null> => {
    try {
        const user = await UserModel.findOne({ login: login });
        if (user) {
            return user
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
};

export const createBankAccount = async (accountData: BankAccount) : Promise<BankAccount | null> => {
    try {
        const account = {
            accountNumber: generateBankAccountNumber(),
            balance: 0,
            currency: accountData.currency,
            type: accountData.type,
            accountStatus: accountData.accountStatus,
            createdAt: moment().valueOf(),
            updatedAt: moment().valueOf()
        }
        const newBankAccount = new BankAccountModel(account)
        return await newBankAccount.save()
    }
    catch (e){
        console.log(e)
        return null
    }
}
export const getUserAccounts = async (userId: string): Promise<BankAccount[] | null> => {
    try{
        const user = await UserModel.findOne({ _id: userId})
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
        return null
    }
}
export const addAccountToUser = async (userId: string, bankAccId: string) => {
    try {
        console.log('userId:',userId, 'bankId', bankAccId)
        return await UserModel.updateOne({_id: userId}, {$push: {bankAccounts: bankAccId}})
    }
    catch(e){
        return null
    }
}
