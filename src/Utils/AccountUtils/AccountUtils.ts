import moment from "moment";

export const generateBankAccountNumber = (): string => {
    let number = '';
    for (let i = 0; i < 16; i++) {
        number += Math.floor(Math.random() * 10).toString();
    }
    return number;
}
export const isGreaterThanZero = (val: number) => {
    if (val > 0) return true
    throw new Error('Value must be greater than 0')
}
export const checkIfTransactionIsInThePast = (val: number) => {
    if (moment(val).isBefore(moment().startOf('d'))){
        throw new Error('Transaction cannot be in the past')
    }
    return true
}