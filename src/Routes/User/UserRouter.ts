import {Router, Request, Response} from "express";
import {authenticateUser} from "../../UserUtils/Authenticator";
import {createUser} from "../../DatabaseUtils/DatabaseUtils";

const userRouter = Router()

userRouter.post('/login', (req: Request, res: Response) => {
    const {login, password} = req.body
    res.send(authenticateUser(login, password))
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

export default userRouter