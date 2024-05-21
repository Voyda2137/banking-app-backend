import {bankAccountStatusTypes} from "../Constants/BankAccountStatusCodes";

export type AccountUpdate = {
    accountId: string,
    status: bankAccountStatusTypes
}