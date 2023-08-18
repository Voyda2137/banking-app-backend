import mongoose, { Schema, Document } from "mongoose";
import {bankAccountStatusTypes} from "../Constants/BankAccountStatusCodes";
import {currencyTypes} from "../Constants/CurrencyTypes";
import {bankAccountTypes} from "../Constants/BankAccountTypes";

export interface BankAccount extends Document {
    accountNumber: string;
    balance: number;
    currency: currencyTypes;
    type: bankAccountTypes;
    status: bankAccountStatusTypes;
    createdAt: number;
    updatedAt: number;
}

const bankAccountSchema = new Schema<BankAccount>({
    accountNumber: { type: String, required: true },
    balance: { type: Number, required: true },
    currency: { type: Number, required: true, enum: currencyTypes },
    type: { type: Number, required: true, enum: bankAccountTypes },
    status: { type: Number, required: true, enum: bankAccountStatusTypes },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
});

export const BankAccountModel = mongoose.model<BankAccount>(
    "accounts",
    bankAccountSchema
);
