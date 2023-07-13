// @ts-ignore
import express, { Express, Request, Response } from 'express';
import {connectToMongo} from "./DatabaseUtils/DatabaseUtils";
import userRouter from "./Routes/User/UserRouter";
import passport from "./UserUtils/Authorizer";

const app: Express = express()
const port = process.env.PORT
const cors = require('cors')

app.use(express.json())
app.use(passport.initialize())
app.use(cors());

// user
app.use('/user', userRouter)
app.get('/protected', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    res.json({ message: 'Protected route' });
});
connectToMongo()

app.listen(port, () => {
    console.log(`xdd`);
});
