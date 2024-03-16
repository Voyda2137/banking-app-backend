import { test } from "@archikoder/architest";

import {
    generateBankAccountNumber,
    isGreaterThanZero,
    checkIfTransactionIsInThePast
} from "../../../src/Utils/AccountUtils/AccountUtils";

export class AccountUtils{

    public _generateBankAccountNumber(){
        return generateBankAccountNumber();
    }

    public _isGreaterThanZero(val: number){
        return isGreaterThanZero(val);
    }

    public _checkIfTransactionIsInThePast(val: number){
        return checkIfTransactionIsInThePast(val);
    }
}

export class AccountUtilsTest extends AccountUtils{

    @test(80)
    public _generateBankAccountNumber(): string {
        return "3398060287600738";
    }

    @test
    public _isGreaterThanZero(val: number = 10): boolean {
        return true;
    }

    @test
    public _checkIfTransactionIsInThePast(val: number = 100): boolean {
        throw new Error("Transaction cannot be in the past")
    }
}

export class SecondAccountUtilsTest extends AccountUtils{
    @test
    public _checkIfTransactionIsInThePast(val: number = 3398060287600738): boolean {
        return true;
    }
}