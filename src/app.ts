// @ts-ignore
import express, { Express, Request, Response } from 'express';
import {connectToMongo} from "./DatabaseUtils/DatabaseUtils";
import userRouter from "./Routes/User/UserRouter";
import passport from "./UserUtils/Authorizer";
import BankAccountRouter from "./Routes/BankAccount/BankAccountRouter";

const app: Express = express()
const port = process.env.PORT
const cors = require('cors')

app.use(express.json())
app.use(passport.initialize())
app.use(cors());

// user
app.use('/user', userRouter)
app.use('/accounts', BankAccountRouter)
connectToMongo()

app.listen(port, () => {
    console.log(`xdd`);
});
