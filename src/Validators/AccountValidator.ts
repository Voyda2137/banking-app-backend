import {body} from "express-validator";
import {checkForUnwantedProperties} from "./Validators";
import {bankAccountStatusTypes} from "../Constants/BankAccountStatusCodes";

const createBankAccountFields = ['currency', 'type']
export const createBankAccountValidator = [
    body().custom( val => checkForUnwantedProperties(val, createBankAccountFields)),
    body('currency')
        .notEmpty()
        .isNumeric()
        .withMessage('Currency must be a number'),
    body('type')
        .notEmpty()
        .isNumeric()
        .withMessage('Type must be a number')
]

const editBankAccountFields = ['status']
export const editStatusBankAccountValidator = [
    body().custom( val => checkForUnwantedProperties(val, editBankAccountFields)),
    body('status')
        .notEmpty()
        .custom((val: bankAccountStatusTypes) => Object.values(bankAccountStatusTypes).includes(val))
        .withMessage('Status must be a valid status type')
    ]