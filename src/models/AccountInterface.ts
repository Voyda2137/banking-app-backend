import mongoose, { Schema, Document } from "mongoose";

export interface BankAccount extends Document {
    accountNumber: string;
    balance: number;
    currency: string;
    type: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const bankAccountSchema = new Schema<BankAccount>({
    accountNumber: { type: String, required: true },
    balance: { type: Number, required: true },
    currency: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true },
});

export const BankAccountModel = mongoose.model<BankAccount>(
    "accounts",
    bankAccountSchema
);
