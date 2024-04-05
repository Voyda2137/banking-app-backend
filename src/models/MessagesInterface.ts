import mongoose, {Document, Schema} from "mongoose";

export interface Messages extends Document {
    message: string
    title: string
    createdAt: number
    updatedAt: number
    icon?: string
}


const messagesSchema = new Schema<Messages>({
    message: {type: String, require: true},
    title: {type: String, require: true},
    createdAt: {type: Number, require: true},
    updatedAt: {type: Number, require: true},
    icon: {type: String, require: false}
})

export const MessagesModel = mongoose.model<Messages>(
    "messages",
    messagesSchema
)