// @ts-ignore
import express, { Express, Request, Response } from 'express';
import * as bodyParser from "body-parser";
const app: Express = express()
const port = 2137
const cors = require('cors')

app.use(bodyParser.json())

app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});
app.post('/xd', async (req, res) => {
    try {
        const alcohol = {
            name: req.body.name
        }
        console.log('alcohol', alcohol)
        res.sendStatus(200)
    }
    catch (e) {
        res.status(500).send('Could not add alcohol')
    }
})
app.listen(port, () => {
    console.log(`xdd`);
});