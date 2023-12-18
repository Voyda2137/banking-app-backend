import {body} from 'express-validator'
import moment from "moment"
import {checkForUnwantedProperties} from "./Validators";

const isOldEnough = (value: number) => {
    if (moment(value).isBefore(moment().subtract(18, 'years'))) {
        throw new Error('User is not old enough');
    }
    return true;
};

const doesNotContainWhiteSpaces = (value: string) => {
    if (/\s/.test(value)) {
        throw new Error('Cannot contain white spaces');
    }
    return true;
};
const registerValidFields : string[] = ['name', 'surname', 'email', 'address', 'phoneNumber', 'login', 'password', 'birthDate']
export const registerUserValidator = [
    body().custom( val => checkForUnwantedProperties(val, registerValidFields)),
    body('name')
        .notEmpty()
        .isLength({min: 3, max: 20})
        .withMessage('Name must be between 3 and 20 characters')
        .isAlpha()
        .withMessage('Name can only contain letters'),
    body('surname')
        .notEmpty()
        .isLength({min: 3, max: 20})
        .withMessage('Surname must be between 3 and 20 characters')
        .isAlpha()
        .withMessage('Surname can only contain letters'),
    body('email')
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('address')
        .notEmpty()
        .isLength({min: 3, max: 20})
        .withMessage('Address must be between 3 and 20 characters'),
    body('phoneNumber')
        .notEmpty()
        .isLength({min: 9, max: 9})
        .withMessage('Phone number must be 9 numbers long')
        .isNumeric()
        .withMessage('Phone number must only user numbers'),
    body('login')
        .notEmpty()
        .isLength({min: 3, max: 20})
        .withMessage('Login must be between 3 and 20 characters')
        .custom(val => {
            try {
                doesNotContainWhiteSpaces(val)
                return true
            }
            catch(e){
                throw e
            }
        }),
    body('password')
        .notEmpty()
        .isLength({min: 3, max: 20})
        .withMessage('Password must be between 3 and 20 characters')
        .custom(val => {
            try {
                doesNotContainWhiteSpaces(val)
                return true
            }
            catch(e){
                throw e
            }
        }),
    body('birthDate')
        .notEmpty()
        .isNumeric()
        .withMessage('Birth date must be numeric')
        .custom(val => {
            try {
                isOldEnough(val)
                return true
            }
            catch(e){
                throw e
            }
    })
]
const loginValidFields : string[] = ['login', 'password']
export const loginUserValidator = [
    body().custom( val => checkForUnwantedProperties(val, loginValidFields)),
    body('login')
        .notEmpty()
        .withMessage('Login cannot be empty'),
    body('password')
        .notEmpty()
        .withMessage('Password cannot be empty')
]
export const editUserValidator = [
    body('name')
        .optional()
        .isLength({min: 3, max: 20})
        .withMessage('Name must be between 3 and 20 characters')
        .isAlpha()
        .withMessage('Name must not contain numbers or special characters'),
    body('surname')
        .optional()
        .isLength({min: 3, max: 20})
        .withMessage('Surname must be between 3 and 20 characters')
        .isAlpha()
        .withMessage('Surname must not contain numbers or special characters'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email'),
    body('password')
        .optional()
        .isLength({min: 3, max: 20})
        .withMessage('Password must be between 3 and 20 characters'),
    body('phoneNumber')
        .optional()
        .isLength({min: 9, max: 9})
        .withMessage('Phone number must be 9 numbers long')
        .isNumeric()
        .withMessage('Phone number must only use numbers'),
    body('address')
        .optional()
        .isLength({min: 3, max: 20})
        .withMessage('Address must be between 3 and 20 characters')
]
export const changeUserToServiceValidator = [
    body('login')
        .notEmpty()
        .withMessage('Login cannot be empty')
]