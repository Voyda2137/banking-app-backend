import express, {Express, NextFunction, Request, Response} from 'express';
import {connectToMongo} from "./Utils/DatabaseUtils/DatabaseUtils";
import userRouter from "./Routes/User/UserRouter";
import passport from "./Utils/UserUtils/Authorizer";
import BankAccountRouter from "./Routes/BankAccount/BankAccountRouter";
import transactionRouter from "./Routes/Transaction/TransactionRouter";

const app: Express = express()
const port = process.env.PORT
const cors = require('cors')

const errorHandler =  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)

    res.status(500).json({
        success: false,
        message: err.message
    })
}

app.use(express.json())
app.use(passport.initialize())
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use('/user', userRouter)
app.use('/accounts', BankAccountRouter)
app.use('/transactions', transactionRouter)

app.use(errorHandler)

connectToMongo()

app.listen(port, () => {
    console.log(`xdd`);
});
