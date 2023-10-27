import mongoose, { Schema, Document } from "mongoose";
import {transactionTypes} from "../Constants/TransactionTypes";
import {currencyTypes} from "../Constants/CurrencyTypes";
import moment from "moment";
import {repeatsEveryTypes} from "../Constants/RepeatsEveryTypes";

type NullableNumber = number | null;

const transactionUpdateSchema = new Schema({
    updatedAt: {type: Number, default: +moment(), required: true}, // will have the value of request time
    repetitionTimeChangedFrom: {type: Number},
    repetitionTimeChangedTo: {type: Number},
    amountChangedFrom: {type: Number},
    amountChangedTo: {type: Number}
})

export interface Transaction extends Document {
    transactionType: transactionTypes;
    amount: number;
    currency: currencyTypes;
    date: number;
    sender: {type: mongoose.Schema.Types.ObjectId, ref: "User"};
    senderInfo: string
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: "User"};
    receiverInfo: string;
    sourceAccount: {type: string, ref: "BankAccount", field: "accountNumber"};
    destinationAccount: {type: string, ref: "BankAccount", field: "accountNumber"};
    title: string;
    description?: string;
    createdAt: number;
    updatedAt: typeof transactionUpdateSchema[];
    isRepeating: boolean;
    repeatsEvery: { interval: NullableNumber, unit: repeatsEveryTypes };
}

const transactionSchema = new Schema<Transaction>({
    transactionType: { type: Number, required: true, enum: transactionTypes },
    amount: { type: Number, required: true },
    currency: { type: Number, required: true, enum: currencyTypes },
    date: { type: Number, required: true, default: +moment() }, // so that all transactions dates are the current time
    sender: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    senderInfo: {type: String},
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    receiverInfo: {type: String},
    sourceAccount: { type: String, ref: 'BankAccount', field: "accountNumber"},
    destinationAccount: { type: String, ref: 'BankAccount', field: "accountNumber"},
    title: { type: String },
    description: { type: String },
    createdAt: { type: Number, required: true, default: +moment() }, // useful when transaction is supposed to be in the future
    updatedAt: [transactionUpdateSchema], // useful for keeping track of transaction updates
    isRepeating: {type: Boolean, default: false},
    repeatsEvery: {interval: {type: Number}, unit: {type: Number, enum: repeatsEveryTypes}, default: {}}
});

export const TransactionModel = mongoose.model<Transaction>("transactions", transactionSchema);
