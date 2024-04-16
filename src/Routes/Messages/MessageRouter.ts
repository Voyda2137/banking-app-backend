import {NextFunction, Request, Response, Router} from "express";
import passport from "../../Utils/UserUtils/Authorizer";
import {MessagesModel} from "../../models/MessagesInterface";
import {createNewMessageValidator, editMessageValidator} from "../../Validators/MessagesValidator";
import {validationResult} from "express-validator";
import {getUserFromJwt} from "../../Utils/UserUtils/GeneralUtils";
import {createMessage, deleteMessage, editMessage, getMessageById} from "../../Utils/MessageUtils/MessageUtils";

const messageRouter = Router();


messageRouter.get('/', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const messages = await MessagesModel.find().sort({_id: -1});

        res.status(200).json({success: true, message: "Successfully getted messages", messages: messages})
    } catch (e) {
        next(e)
    }
});

messageRouter.get('/:id', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message = await getMessageById(req.params.id);
        if (!message) {
            return res.status(404).json({success: false, message: "Message not found"})
        }

        res.status(200).json({success: true, message: "Successfully getted message", messages: message})
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

messageRouter.put('/edit/:id', editMessageValidator, passport.authenticate('jwt', {session: false}), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader: string | undefined = req.header("Authorization")
        const user = await getUserFromJwt(authHeader);

        if (!user || !user?.isService) {
            throw new Error("could not verify user!")
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success: false, errors: errors.array()});
        }

        const editedMessage = await editMessage(req.params.id, req.body);

        if (!editedMessage) {
            return res.status(404).json({success: false, message: 'Message not found'});
        }

        return res.status(200).json({success: true, message: 'Successfully edited the message', editedMessage});
    } catch (e) {
        next(e)
    }
})

messageRouter.delete('/delete/:id', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader: string | undefined = req.header("Authorization")
        const user = await getUserFromJwt(authHeader);

        if (!user || !user?.isService) {
            throw new Error("could not verify user!")
        }
        const deletedMessage = await deleteMessage(req.params.id);

        if (!deletedMessage) {
            return res.status(404).json({success: false, message: 'Message not found'});
        }

        return res.status(200).json({success: true, message: 'Successfully deleted the message', deletedMessage});
    } catch (e) {
        next(e)
    }
})

export default messageRouter