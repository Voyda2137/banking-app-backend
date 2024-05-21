import jwt, {Secret} from "jsonwebtoken";
import {CustomJwtPayload} from "../../models/JwtInterface";
import {getUserByLogin} from "../DatabaseUtils/DatabaseUtils";
import {User} from "../../models/UserInterface";

export const extractJwtFromReq = (authHeader: string | undefined) => {
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.replace('Bearer ', '')
    }
    return undefined
}

export const extractLoginFromJwt = async (token: string) => {
    const decodedToken = jwt.verify(token, process.env.AUTHORIZER_SECRET as Secret) as CustomJwtPayload
    return decodedToken.login
}

export const getUserFromJwt = async (authHeader: string | undefined) => {
    const token = await extractJwtFromReq(authHeader)
    if(token){
        const login = await extractLoginFromJwt(token)

        return getUserByLogin(login)
    }
    else return null
}

export const isUserService = (user: User) => {
    return user.isService
}