import { authenticateUser } from '../../../src/Utils/UserUtils/Authenticator';
import { test } from '@archikoder/architest';

export class Authenticator{

    public async _authenticateUser({login, password}: { login: string, password: string }, _UserModel?: { findOne: Function }){
        return authenticateUser({ login, password }, _UserModel);
    }
}

export class SimpleTest extends Authenticator{

    @test
    public async _authenticateUser({ login, password }: any = { login: "", password: ""}, _UserModel = {
        findOne: () => null
    }): Promise<any> {
        throw new Error("User not found");
    }
}
