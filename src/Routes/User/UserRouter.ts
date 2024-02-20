import {Router, Request, Response, NextFunction} from "express";
import {authenticateUser} from "../../Utils/UserUtils/Authenticator";
import {changeSettings, changeUserToService, createUser, editUser} from "../../Utils/DatabaseUtils/DatabaseUtils";
import passport from "../../Utils/UserUtils/Authorizer";
import {getUserFromJwt} from "../../Utils/UserUtils/GeneralUtils";
import moment from "moment";
import {
    changeSettingsValidator,
    changeUserToServiceValidator,
    editUserValidator,
    loginUserValidator,
    registerUserValidator
} from "../../Validators/UserValidator";
import {validationResult} from "express-validator"
import {generateRefreshToken, generateToken} from "../../Utils/UserUtils/JWTgenerator";

const userRouter = Router()

userRouter.post('/login', loginUserValidator, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const response = await authenticateUser(req.body);

        if (response) {
            return res.status(200).json({ success: true, token: response.token }); // not optimal
        }
    }
    catch (e) {
        next(e)
    }
});
userRouter.post('/register', registerUserValidator, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const userObject = {
            ...req.body,
            createdAt: +moment(),
        };

        const val = await createUser(userObject);

        if (val) {
            return res.status(200).json({ success: true, message: 'Successfully created user' });
        } else {
            return res.status(500).json({ success: false, message: 'User with this login or email already exists' });
        }
    } catch (e) {
        next(e);
    }
});
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
                createdAt: response.createdAt,
                isService: response.isService,
                settings: response.settings
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
    } catch (e) {
        next(e)
    }
});
userRouter.put('/edit', editUserValidator, passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const authHeader: string | undefined = req.header('Authorization')
        const userData = {
            ...req.body,
            token: authHeader
        }
        const val = await editUser(userData)
        if(val) return res.status(200).json({success: true, message: 'Successfuly changed user data'})

    }
    catch (e) {
        next(e)
    }
})
userRouter.put('/addService', changeUserToServiceValidator, passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const authHeader: string | undefined = req.header('Authorization')
        if (authHeader){
            const createdService = await changeUserToService({token: authHeader, login: req.body.login})
            if(createdService) return res.status(200).json({success: true, message: 'Successfully changed user to service'})
            else throw new Error('Cannot change user to service')
        }
    }
    catch (e) {
        next(e)
    }
})
userRouter.post('/refreshToken', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader: string | undefined = req.header('Authorization')

        const response = await getUserFromJwt(authHeader)
        if (response){
            const newAccessToken = generateRefreshToken(response);
            return res.status(200).json({ success: true, token: newAccessToken });
        }
    }
    catch (e) {
        next(e)
    }
});
userRouter.put('/settings', changeSettingsValidator, passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const authHeader: string | undefined = req.header('Authorization')
        const user = await getUserFromJwt(authHeader)
        const response = await changeSettings({userId: user?._id, locale: req.body?.locale, mainAccount: req.body?.mainAccount})
        if (!response) throw new Error('locale or mainAccount must be passed')
        return res.status(200).json({success: true, message: 'Successfully changed the settings'})
    }
    catch (e) {
        next(e)
    }
})
export default userRouter