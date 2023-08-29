import {Router, Request, Response, NextFunction} from "express";
import {authenticateUser} from "../../Utils/UserUtils/Authenticator";
import {createUser, editUser, getUserByLogin} from "../../Utils/DatabaseUtils/DatabaseUtils";
import passport from "../../Utils/UserUtils/Authorizer";
import {validateRequestProperties} from "../../Validators/Validators";
import {getUserFromJwt} from "../../Utils/UserUtils/GeneralUtils";
import moment from "moment";

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
        const expectedProperties = ['name', 'surname', 'email', 'address', 'phoneNumber', 'login', 'password', 'birthDate']
        const validateRequest = await validateRequestProperties(req.body, expectedProperties)

        if(!validateRequest.success){
            throw new Error(validateRequest.message)
        }
        if(moment(req.body.birthDate).isAfter(moment().startOf('d').subtract(18, 'y'))){
            throw new Error('User is not old enough')
        }
        const userObject = {
            ...req.body,
            createdAt: +moment()
        }
        createUser(userObject).then(val=> {
            if(val){
                return res.status(200).json({ success: true, message: 'Successfully created user' })
            }
            else {
                return res.status(500).json({ success: false, message: 'User with this login or email already exists' });
            }
        })
    }
    catch (e) {
        next(e)
    }
})
userRouter.get('/user', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
    try {

        const authHeader: string | undefined = req.header('Authorization')

        const response = await getUserFromJwt(authHeader)

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
                birthDate: response.birthDate,
                createdAt: response.createdAt
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
userRouter.put('/edit', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader: string | undefined = req.header('Authorization')
        const userData = {
            ...req.body,
            token: authHeader
        }
        const val = await editUser(userData)
        switch(val){
            case 0:
                return res.status(200).json({success: true, message: 'Successfuly changed user data'})
            case 1:
                throw new Error('Name has not been changed')
            case 2:
                throw new Error('Surname has not been changed')
            case 3:
                throw new Error('Email has not been changed')
            case 4:
                throw new Error('Password has not been changed')
            case 5:
                throw new Error('Phone number has not been changed')
            case 6:
                throw new Error('Address has not been changed')
        }
    }
    catch (e) {
        next(e)
    }
})
export default userRouter