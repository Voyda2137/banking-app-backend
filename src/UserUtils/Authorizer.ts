import passport from "passport";
import dotenv from 'dotenv'
import {Strategy, ExtractJwt} from "passport-jwt";
import {UserModel} from "../models/UserInterface";

dotenv.config()

const jwtOptions = {
    authorizerSecretKey: process.env.AUTHORIZER_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}
passport.use(new Strategy(jwtOptions, async (payload, done) => {
    try {
        const user = await UserModel.findById(payload.sub)
        if(user){
            return done(null, user)
        }
        else {
            return done(null, false)
        }
    }
    catch (e){
        return done(Error, false)
    }
}))