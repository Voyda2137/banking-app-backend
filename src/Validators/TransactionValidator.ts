import {body} from "express-validator";
import {checkForUnwantedProperties} from "./Validators";
import {checkIfTransactionIsInThePast, isGreaterThanZero} from "../Utils/AccountUtils/AccountUtils";

const createTransactionFields: string[] = [
    'transactionType',
    'amount',
    'currency',
    'sourceAccount',
    'destinationAccount',
    'title',
    'date',
    'isRepeating',
    'repeatsEvery'
]
export const createTransactionValidator = [
    body().custom( val => checkForUnwantedProperties(val, createTransactionFields)),
    body('transactionType')
        .notEmpty()
        .isNumeric()
        .withMessage('transactionType must be a number'),
    body('amount')
        .notEmpty()
        .custom(val => isGreaterThanZero(val))
        .isNumeric()
        .withMessage('amount must be a number'),
    body('currency')
        .notEmpty()
        .isNumeric()
        .withMessage('currency must be a number'),
    body('sourceAccount')
        .notEmpty()
        .withMessage('sourceAccount cannot be empty'),
    body('title')
        .notEmpty()
        .isLength({min: 3, max: 20})
        .withMessage('Must be between 3 and 20 characters'),
    body('date')
        .optional()
        .isNumeric()
        .withMessage('date must be a number')
        .custom(val => checkIfTransactionIsInThePast(val)),
    body('isRepeating')
        .optional()
        .isBoolean()
        .withMessage('isRepeating must be boolean'),
    body('repeatsEvery')
        .optional()
        .isObject()
        .withMessage('repeatsEvery must be an object')
]