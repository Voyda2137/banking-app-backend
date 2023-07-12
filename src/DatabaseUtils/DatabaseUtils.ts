import mongoose from "mongoose";
import dotenv from "dotenv";
import {UserModel, User} from "../models/UserInterface";
const bcrypt = require('bcrypt')

dotenv.config()

export const connectToMongo = () => {
    const connectionString = process.env.MONGO_CONNECTION
    if(connectionString){
        mongoose.connect(connectionString).then(() => {
            console.log('Connected to mongo')
        })
    }
    else console.log('Cannot connect to mongo')
}
export const createUser = async (userData: User): Promise<User | null> => {
    try {
        const { login, email, password } = userData;
        const newUser = new UserModel(userData);
        const existingUser = await UserModel.findOne({ $or: [{ login }, { email }] });

        if (existingUser) {
            return null;
        }

        const saltRounds = 10;

        newUser.password = await bcrypt.hash(password, saltRounds);

        return await newUser.save();

    } catch (error) {
        console.error('Error creating user:', error);
        return null;
    }
};
