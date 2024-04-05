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