import {NextFunction, Request, Response, Router} from "express";
import passport from "../../Utils/UserUtils/Authorizer";
import {MessagesModel} from "../../models/MessagesInterface";
import {createNewMessageValidator} from "../../Validators/MessagesValidator";
import {validationResult} from "express-validator";
import {getUserFromJwt} from "../../Utils/UserUtils/GeneralUtils";
import {createMessage} from "../../Utils/MessageUtils/MessageUtils";

const messageRouter = Router();


messageRouter.get('/', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const messages = await MessagesModel.find().sort({_id: -1});

        res.status(200).json({success: true, message: "Successfully getted messages", messages: messages})
    } catch (e) {
        next(e)
    }
});

messageRouter.post('/', createNewMessageValidator, passport.authenticate('jwt', {session: false}), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success: false, errors: errors.array()});
        }

        const authHeader = req.header("Authorization")

        const user = await getUserFromJwt(authHeader)

        if (!user || !user?.isService) {
            throw new Error("could not verify user!")
        }

        createMessage(req.body).then(response => {
            return res.status(200).json({success: true, message: "Successfully created the new message"})
        })
    } catch (e) {
        next(e)
    }
})

messageRouter.put('/edit', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader: string | undefined = req.header("Authorization")
        const user = await getUserFromJwt(authHeader);

        if (!user || !user?.isService) {
            throw new Error("could not verify user!")
        }

        const { _id, message, title, icon } = req.body;

        const updatedMessage = await MessagesModel.findByIdAndUpdate(_id, { message, title, icon }, { new: true });

        if (!updatedMessage) {
            return res.status(404).json({success: false, message: 'Message not found'});
        }

        return res.status(200).json({success: true, message: 'Successfully updated the message', updatedMessage});
    } catch (e) {
        next(e)
    }
})

export default messageRouter