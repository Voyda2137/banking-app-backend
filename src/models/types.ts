import {BankAccount} from "./AccountInterface";

export type AccountUpdate = {
    accountId: string,
    status: Pick<BankAccount,"status">
}