import {
    extractJwtFromReq,
    extractLoginFromJwt,
    getUserFromJwt
} from "../../../src/Utils/UserUtils/GeneralUtils";
import { test } from '@archikoder/architest';
import { User } from "../../../src/models/UserInterface";
import { JsonWebTokenError } from "jsonwebtoken";

export class GeneralUtils {

    _extractJwtFromReq(authHeader: string | undefined) {
        return extractJwtFromReq(authHeader);
    }

    async _extractLoginFromJwt(token: string) {
        return await extractLoginFromJwt(token);
    }

    async _getUserFromJwt(authHeader: string | undefined) {
        return await getUserFromJwt(authHeader);
    }
}

export class GeneralUtilsTest extends GeneralUtils{

    @test
    _extractJwtFromReq(authHeader: string | undefined = "empty_auth_header"): string | undefined {
        return undefined
    }

    @test
    async _extractLoginFromJwt(token: string = "invalid_token_"): Promise<string> {
        throw new JsonWebTokenError("jwt malformed")
    }
    
    @test
    async _getUserFromJwt(authHeader: string | undefined = "invalid_header_"): Promise<User | null> {
        return null;
    }
}