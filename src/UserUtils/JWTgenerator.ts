import jwt from 'jsonwebtoken';
import {User} from "../models/UserInterface";
import dotenv from "dotenv";

dotenv.config()

export const generateToken = (user: User): string => {
    return jwt.sign({ login: user.login }, process.env.AUTHORIZER_SECRET, { expiresIn: '1h' });
}

