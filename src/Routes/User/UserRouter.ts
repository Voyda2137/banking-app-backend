import {Router, Request, Response} from "express";
import {authenticateUser} from "../../UserUtils/Authenticator";
import {createUser, getUserByLogin} from "../../DatabaseUtils/DatabaseUtils";
import passport from "../../UserUtils/Authorizer";
import {User} from "../../models/UserInterface";
import {validateRequestProperties} from "../../Validators/Validators";
import {authenticateUserCodes} from "../../Constants/ResponseCodes";

const userRouter = Router()

userRouter.post('/login', async (req: Request, res: Response) => {
    const expectedProperties = ['login', 'password']
    const validateRequest = await validateRequestProperties(req.body, expectedProperties)
    if (validateRequest.success) {
        authenticateUser(req.body).then(response => {
            switch (response.code) {
                case authenticateUserCodes.USER_NOT_FOUND: {
                    return res.status(401).json({success: false, message: 'User not found'});
                }
                case authenticateUserCodes.INVALID_PASSWORD: {
                    return res.status(401).json({success: false, message: 'Invalid password'});
                }
                case authenticateUserCodes.SUCCESS: {
                    return res.status(200).json({success: true, token: response.token});
                }
                default:
                    break
            }
        })
    } else {
        return res.status(500).json(validateRequest)
    }
})
userRouter.post('/register', (req: Request, res: Response) => {
    createUser(req.body).then(val=> {
        if(val === null){
            res.status(409).json({success: false, message: 'User with given login or email already exists'})
        }
        else {
            res.status(200).json({ success: true, message: 'Successfully created user' })
        }
    })
})
userRouter.get('/user', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    getUserByLogin(req.body).then((response: User | null) => {
        if (response === null) {
            res.status(500).json({ success: false, message: 'Could not get user details' });
        } else {
            res.status(200).json({
                message: 'Successfully retrieved the user details',
                response,
                success: true,
            });
        }
    });
});

export default userRouter