interface ValidationResult {
    success: boolean,
    message?: string
}

export const validateRequestProperties = async (requestObject: object, expectedProperties: string[]): Promise<ValidationResult> => {
    for (const prop of expectedProperties) {
        if(!requestObject.hasOwnProperty(prop)){
            return {success: false, message: `Error missing property: ${prop}`}
        }
    }
    return {success: true}
}
