import {Messages, MessagesModel} from "../../models/MessagesInterface";
import moment from "moment";

export const createMessage = async (messageData: Partial<Messages>) => {
    try {
        const tmp = {
            ...messageData,
            createdAt: +moment(),
            updatedAt: +moment()
        }

        const newMessage = new MessagesModel(tmp);
        return await newMessage.save();
    } catch (e) {
        console.error(e)
        return null;
    }
}

export const getMessageById = async (id: string) => {
    try {
        return await MessagesModel.findById(id);
    } catch (e) {
        console.error(e)
        return null;
    }
}

export const deleteMessage = async (id: string) => {
    try {
        return await MessagesModel.findByIdAndDelete(id);
    } catch (e) {
        console.error(e)
        return null;
    }
}

export const editMessage = async (id: string, messageData: Partial<Messages>) => {
    try {
        const tmp = {
            ...messageData,
            updatedAt: +moment()
        }
        return await MessagesModel.findByIdAndUpdate(id, tmp, {new: true});
    } catch (e) {
        console.error(e)
        return null;
    }
}