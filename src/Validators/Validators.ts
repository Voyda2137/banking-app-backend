export const checkForUnwantedProperties = (value: any, allowedProperties: string[]) => {
    const unwantedProperties = Object.keys(value).filter((key) => !allowedProperties.includes(key));
    if (unwantedProperties.length > 0) {
        throw new Error(`Unexpected properties found: ${unwantedProperties.join(', ')}`);
    }
    return true;
};
