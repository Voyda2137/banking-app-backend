import jwt, {Secret} from 'jsonwebtoken';
import {User} from "../../models/UserInterface";
import dotenv from "dotenv";

dotenv.config()

export const generateToken = (user: User): string => {
    const secretOrPrivateKey: Secret = process.env.AUTHORIZER_SECRET as Secret;
    return jwt.sign({ login: user.login }, secretOrPrivateKey, { expiresIn: '1h' });
}

