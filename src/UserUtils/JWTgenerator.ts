import jwt from 'jsonwebtoken';
import {User} from "../models/UserInterface";
import dotenv from "dotenv";

dotenv.config()

export const generateToken = (user: User): string => {
    const secretOrPrivateKey = process.env.AUTHORIZER_SECRET;
    return jwt.sign({ login: user.login }, secretOrPrivateKey, { expiresIn: '1h' });
}

