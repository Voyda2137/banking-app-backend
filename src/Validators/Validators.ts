interface ValidationResult {
    success: boolean,
    message?: string
}

export const validateRequestProperties = (requestObject: object, expectedProperties: string[]): ValidationResult => {
    for (const prop of expectedProperties) {
        if(!requestObject.hasOwnProperty(prop)){
            return {success: false, message: `Error missing property: ${prop}`}
        }
    }
    return {success: true}
}
