import express, { Express } from 'express';
import {connectToMongo} from "./Utils/DatabaseUtils/DatabaseUtils";
import userRouter from "./Routes/User/UserRouter";
import passport from "./Utils/UserUtils/Authorizer";
import BankAccountRouter from "./Routes/BankAccount/BankAccountRouter";
import transactionRouter from "./Routes/Transaction/TransactionRouter";

const app: Express = express()
const port = process.env.PORT
const cors = require('cors')

app.use(express.json())
app.use(passport.initialize())
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use('/user', userRouter)
app.use('/accounts', BankAccountRouter)
app.use('/transactions', transactionRouter)

connectToMongo()

app.listen(port, () => {
    console.log(`xdd`);
});
