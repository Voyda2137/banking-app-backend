import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User, UserModel } from "../models/UserInterface";
import { generateToken } from "./JWTgenerator";
import { Document } from 'mongoose';

interface AuthenticatedUser extends User {
    token: string;
}
export const authenticateUser = async (req: Request, res: Response): Promise<void> => {
    const { login, password } = req.body;

    const user = await UserModel.findOne({ login });

    if (!user) {
        res.status(401).json({ success: false, message: 'User not found' });
        return;
    }

    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
        res.status(401).json({ success: false, message: 'Invalid password' });
        return;
    }

    const token = generateToken(user);

    const authenticatedUser: AuthenticatedUser & Document<any> = {
        ...user.toObject(),
        token,
    } as AuthenticatedUser & Document<any>;

    res.status(200).json({ success: true, token: authenticatedUser.token });
};
