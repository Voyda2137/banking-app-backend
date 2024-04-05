import {body} from "express-validator";
import {checkForUnwantedProperties} from "./Validators";

const createNewMessageFields = ['message', 'title', 'icon']
export const createNewMessageValidator = [
    body().custom( val => checkForUnwantedProperties(val, createNewMessageFields)),
    body('message')
        .notEmpty()
        .isString()
        .withMessage("Message must be a string."),
    body("title")
        .notEmpty()
        .isString()
        .withMessage("Title must be a string."),
    body("icon")
        .isString()
        .withMessage("Icon must be a string (fontawesome class).")
]