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
const bodyParser = require('body-parser');
const app = (0, express_1.default)();
const port = process.env.PORT;
const cors = require('cors');
app.use(bodyParser.json());
app.use(passport_1.default.initialize());
app.use(cors());
// user
app.use('/login', UserRouter_1.default);
app.use('/register', UserRouter_1.default);
(0, DatabaseUtils_1.connectToMongo)();
app.listen(port, () => {
    console.log(`xdd`);
});
