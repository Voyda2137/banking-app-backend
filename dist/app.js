"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const DatabaseUtils_1 = require("./DatabaseUtils/DatabaseUtils");
const UserRouter_1 = __importDefault(require("./Routes/User/UserRouter"));
const app = (0, express_1.default)();
const port = process.env.PORT;
const cors = require('cors');
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use(cors());
// user
app.use('/user', UserRouter_1.default);
app.get('/protected', passport_1.default.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ message: 'Protected route' });
});
(0, DatabaseUtils_1.connectToMongo)();
app.listen(port, () => {
    console.log(`xdd`);
});
