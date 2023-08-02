import mongoose, { Schema, Document } from "mongoose";

export interface BankAccount extends Document {
    accountNumber: string;
    balance: number;
    currency: string;
    type: string;
    accountStatus: string;
    createdAt: number;
    updatedAt: number;
}

const bankAccountSchema = new Schema<BankAccount>({
    accountNumber: { type: String, required: true },
    balance: { type: Number, required: true },
    currency: { type: String, required: true },
    type: { type: String, required: true },
    accountStatus: { type: String, required: true },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
});

export const BankAccountModel = mongoose.model<BankAccount>(
    "accounts",
    bankAccountSchema
);
