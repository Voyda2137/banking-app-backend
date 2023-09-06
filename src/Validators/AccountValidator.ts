import {body} from "express-validator";
import {checkForUnwantedProperties} from "./Validators";

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