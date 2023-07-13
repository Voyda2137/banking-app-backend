import passport from "passport";
import dotenv from 'dotenv'
import {Strategy, ExtractJwt} from "passport-jwt";
import {UserModel} from "../models/UserInterface";

dotenv.config()

const jwtOptions = {
    secretOrKey: process.env.AUTHORIZER_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}
passport.use(new Strategy(jwtOptions, async (payload, done) => {
    try {
        const user = await UserModel.findById({login: payload.login});
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (e) {
        console.error(e);
        return done(e, false);
    }
}));
export default passport;
