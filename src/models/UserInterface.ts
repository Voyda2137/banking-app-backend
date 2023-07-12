import mongoose, {Schema, Document} from "mongoose";

export interface User extends Document {
    name: string;
    surname: string;
    email: string;
    login: string;
    password: string;
}
const userSchema = new Schema<User>({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, required: true},
    login: {type: String, required: true},
    password: {type: String, required: true}
})

export const UserModel = mongoose.model<User>('users', userSchema)

