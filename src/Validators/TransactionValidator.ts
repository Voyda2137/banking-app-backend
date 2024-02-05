import {body} from "express-validator";
import {checkForUnwantedProperties} from "./Validators";
import {checkIfTransactionIsInThePast, isGreaterThanZero} from "../Utils/AccountUtils/AccountUtils";
import {transactionTypes} from "../Constants/TransactionTypes";

const createTransactionFields: string[] = [
    'transactionType',
    'amount',
    'currency',
    'sourceAccount',
    'destinationAccount',
    'title',
    'date',
    'isRepeating',
    'repeatsEvery',
    'receiverInfo'
]
export const createTransactionValidator = [
    body().custom( val => checkForUnwantedProperties(val, createTransactionFields)),
    body('transactionType')
        .notEmpty()
        .isNumeric()
        .withMessage('transactionType must be a number and not empty'),
    body('amount')
        .notEmpty()
        .custom(val => isGreaterThanZero(val))
        .isNumeric()
        .withMessage('amount must be a number and not empty'),
    body('currency')
        .notEmpty()
        .isNumeric()
        .withMessage('currency must be a number and not empty'),
    body('date')
        .optional()
        .isNumeric()
        .withMessage('date must be a number')
        .custom(val => checkIfTransactionIsInThePast(val)),
    body('sourceAccount')
        .notEmpty()
        .isString()
        .withMessage('sourceAccount must be a string and not empty'),
    body().custom(val => {
         if (val.transactionType === transactionTypes.TRANSFER){
            if (!val.destinationAccount && typeof val.destinationAccount !== "string") throw new Error('destinationAccount cannot be empty and must be string')
            if (!val.receiverInfo && typeof val.receiverInfo !== "string") throw new Error('receiverInfo cannot be empty and must be string')
            if (!val.title && typeof val.title !== "string") throw new Error('title cannot be empty and must be string')
            if (val.title.length < 3 || val.title.length > 20) throw new Error('title must be between 3 and 20 characters')
            if (val.isRepeating && typeof val.isRepeating !== 'boolean') throw new Error('isRepeating must be boolean')
            if (val.isRepeating && typeof val.repeatsEvery !== 'object') throw new Error('repeatsEvery must be an object')
            if (val.repeatsEvery && typeof val.repeatsEvery.interval !== 'number') throw new Error('interval must be numeric')
            if (val.repeatsEvery && typeof val.repeatsEvery.unit !== 'number') throw new Error('unit must be numeric')
        }
        return true
    })
]