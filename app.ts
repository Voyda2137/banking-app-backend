// @ts-ignore
import express, { Express, Request, Response } from 'express';

const app: Express = express()
const port = 2137
app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`xdd`);
});