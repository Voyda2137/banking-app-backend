import {
    generateToken,
    generateRefreshToken
} from "../../../src/Utils/UserUtils/JWTgenerator"
import { User } from "../../../src/models/UserInterface";
import { test } from "@archikoder/architest";

export class JWTgenerator{

    _generateToken(user: User): string{
        return generateToken(user);
    }

    _generateRefreshToken(user: User): string{
        return generateRefreshToken(user);
    }
}

export class JWTgeneratorTest extends JWTgenerator{

    constructor(){
        super();
        process.env.AUTHORIZER_SECRET = "secret";
    }

    @test(90)
    _generateToken(user = {userId: "", name: "", email: "", login: ""}): string {
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IiIsImlhdCI6MTcwODU5OTEwNCwiZXhwIjoxNzA4NjAyNzA0fQ.nUhY4mzdIXIjZf-rspjFu1uH5vpe1agN8samaV6s2VM"
    }

    @test(75)
    _generateRefreshToken(user = {userId: "", name: "", email: "", login: ""}): string {
        return "invalid_token"
    }
}