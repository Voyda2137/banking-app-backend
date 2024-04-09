import express, {Express, NextFunction, Request, Response} from 'express';
import {connectToMongo} from "./Utils/DatabaseUtils/DatabaseUtils";
import userRouter from "./Routes/User/UserRouter";
import passport from "./Utils/UserUtils/Authorizer";
import BankAccountRouter from "./Routes/BankAccount/BankAccountRouter";
import transactionRouter from "./Routes/Transaction/TransactionRouter";
import messageRouter from "./Routes/Messages/MessageRouter";

const app: Express = express()
const port = process.env.PORT
const cors = require('cors')

const httpsEnforcer = (req: Request, res: Response, next: NextFunction) => {
    if (req.header('x-forwarded-proto') !== undefined && req.header('x-forwarded-proto') !== 'https') {
        if (req.header('host') !== 'localhost') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        }
    } else {
        next();
    }
};


const errorHandler =  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)

    res.status(500).json({
        success: false,
        message: err.message
    })
}

// app.use(httpsEnforcer)
app.use(express.json())
app.use(passport.initialize())
app.use(cors({credentials: true, origin: ['http://localhost:2137', "http://localhost:2147", 'https://mg-banking.pl', 'https://dev.mg-banking.pl']}));
// app.use(enforce.HTTPS({trustProtoHeader: true}))

app.use('/user', userRouter)
app.use('/accounts', BankAccountRouter)
app.use('/transactions', transactionRouter)
app.use('/messages', messageRouter)

app.use(errorHandler)

connectToMongo()

app.listen(port, () => {
    console.log(`xdd`);
});
