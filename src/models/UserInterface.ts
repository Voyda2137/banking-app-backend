import mongoose, { Schema, Document } from "mongoose";
import {BankAccount} from "./AccountInterface";
import {languages} from "../Constants/Languages";

export interface User extends Document {
    userId: string;
    name: string;
    surname: string;
    email: string;
    address: string;
    phoneNumber: number;
    login: string;
    password: string;
    bankAccounts: [{type: mongoose.Schema.Types.ObjectId, ref: "BankAccount"}];
    transactions: [{type: mongoose.Schema.Types.ObjectId, ref: "Transaction"}];
    birthDate: number;
    createdAt: number;
    isService: boolean;
    settings: {
        locale: languages;
        mainAccount: [{type: mongoose.Schema.Types.ObjectId, ref: "BankAccount"}];
    }
}

const userSchema = new Schema<User>({
    userId: String,
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    login: { type: String, required: true },
    password: { type: String, required: true },
    bankAccounts: [{ type: mongoose.Schema.Types.ObjectId, default: [], ref: 'BankAccount' }],
    transactions: [{ type: mongoose.Schema.Types.ObjectId, default: [], ref: 'Transaction' }],
    birthDate: {type: Number, required: true},
    createdAt: {type: Number},
    isService: {type: Boolean},
    settings: {
        locale: {type: String, enum: languages },
        mainAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'BankAccount' }
    }
});

export const UserModel = mongoose.model<User>("users", userSchema);
