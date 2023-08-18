import mongoose, { Schema, Document } from "mongoose";
import {BankAccount} from "./AccountInterface";

export interface User extends Document {
    name: string;
    surname: string;
    email: string;
    address: string;
    phoneNumber: number;
    login: string;
    password: string;
    bankAccounts: [{type: mongoose.Schema.Types.ObjectId, ref: "BankAccount"}];
    transactions: [{type: mongoose.Schema.Types.ObjectId, ref: "Transaction"}]
}

const userSchema = new Schema<User>({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    login: { type: String, required: true },
    password: { type: String, required: true },
    bankAccounts: [{ type: mongoose.Schema.Types.ObjectId, default: [], ref: 'BankAccount' }],
    transactions: [{ type: mongoose.Schema.Types.ObjectId, default: [], ref: 'Transaction' }],
});

export const UserModel = mongoose.model<User>("users", userSchema);
