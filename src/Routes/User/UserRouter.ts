import {Router, Request, Response, NextFunction} from "express";
import {authenticateUser} from "../../Utils/UserUtils/Authenticator";
import { createUser, getUserByLogin } from "../../Utils/DatabaseUtils/DatabaseUtils";
import passport from "../../Utils/UserUtils/Authorizer";
import {validateRequestProperties} from "../../Validators/Validators";

const userRouter = Router()

userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const expectedProperties = ['login', 'password']
        const validateRequest = await validateRequestProperties(req.body, expectedProperties)

        if(!validateRequest.success){
            throw new Error(validateRequest.message)
        }

        const response = await authenticateUser(req.body);

        if (response) {
            return res.status(200).json({ success: true, token: response.token }); // not optimal
        }
        // res.cookie('jwt', response.token, {
        //     httpOnly: true,
        //     sameSite: 'none',
        //     maxAge: 3600 * 1000,
        //     // secure: true
        // });
    }
    catch (e) {
        next(e)
    }
});
userRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const expectedProperties = ['name', 'surname', 'email', 'address', 'phoneNumber', 'login', 'password']
        const validateRequest = await validateRequestProperties(req.body, expectedProperties)

        if(!validateRequest.success){
            throw new Error(validateRequest.message)
        }

        createUser(req.body).then(val=> {
            if(val){
                return res.status(200).json({ success: true, message: 'Successfully created user' })
            }
            else {
                return res.status(500).json({ success: false, message: 'Failed to create user' });
            }
        })
    }
    catch (e) {
        next(e)
    }
})
userRouter.get('/user', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const expectedProperties = ['login']
        const validateRequest = await validateRequestProperties(req.body, expectedProperties)

        if(!validateRequest.success){
            throw new Error(validateRequest.message)
        }

        const response = await getUserByLogin(req.body);

        if (response) {
            const responseData = {
                userId: response._id.toString(),
                accountIds: response.bankAccounts,
                transactionIds: response.transactions,
                name: response.name,
                surname: response.surname,
                email: response.email,
                address: response.address,
                phoneNumber: response.phoneNumber,
            };

            return res.status(200).json({
                success: true,
                message: 'Successfully retrieved the user details',
                responseData
            });
        }
        else {
            throw new Error('User not found')
        }

        // res.cookie('userId', response._id.toString(), {
        //     httpOnly: true,
        //     maxAge: 3600 * 24 * 7, // valid for a week
        //     secure: true
        // });
        //
        // res.cookie('accountIds', JSON.stringify(response.bankAccounts), {
        //     httpOnly: true,
        //     maxAge: 3600 * 24 * 7, // valid for a week
        //     secure: true
        // });


    } catch (e) {
        next(e)
    }
});
export default userRouter