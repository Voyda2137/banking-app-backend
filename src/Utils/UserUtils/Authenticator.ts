import { User, UserModel } from "../../models/UserInterface";
import { generateToken } from "./JWTgenerator";
import { Document } from 'mongoose';
import {validateRequestProperties} from "../../Validators/Validators";
const bcrypt = require('bcrypt')


interface AuthenticatedUser extends User {
    token: string;
}

/**
 *
 * @param login
 * @param password
 * @returns code: 1 - user not found, 2 - invalid password, 3 - success
 */
export const authenticateUser = async ({ login, password }: { login: string, password: string }): Promise<AuthenticatedUser | null> => {
    try {
        const user = await UserModel.findOne({ login });

        if (!user) {
            throw new Error('User not found');
        }

        const validatePassword = await bcrypt.compare(password, user.password);

        if (!validatePassword) {
            throw new Error('Invalid password');
        }

        const token = generateToken(user);

        const authenticatedUser: AuthenticatedUser & Document<any> = {
            ...user.toObject(),
            token,
        } as AuthenticatedUser & Document<any>;

        return authenticatedUser;
    }
    catch (e) {
        if (e instanceof Error) {
            throw new Error(e.message);
        }
        else {
            throw new Error('Could not authenticate the user');
        }
    }
};

