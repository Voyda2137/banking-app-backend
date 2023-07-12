import jwt from 'jsonwebtoken';
import {User} from "../models/UserInterface";

export const generateToken = (user: User): string => {
    return jwt.sign({ login: user.login }, 'your-secret-key', { expiresIn: '1h' });
}

