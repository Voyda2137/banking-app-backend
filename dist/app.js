"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DatabaseUtils_1 = require("./Utils/DatabaseUtils/DatabaseUtils");
const UserRouter_1 = __importDefault(require("./Routes/User/UserRouter"));
const Authorizer_1 = __importDefault(require("./Utils/UserUtils/Authorizer"));
const BankAccountRouter_1 = __importDefault(require("./Routes/BankAccount/BankAccountRouter"));
const TransactionRouter_1 = __importDefault(require("./Routes/Transaction/TransactionRouter"));
const app = (0, express_1.default)();
const port = process.env.PORT;
const cors = require('cors');
const enforce = require('express-sslify');
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message
    });
};
app.use(express_1.default.json());
app.use(Authorizer_1.default.initialize());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(enforce.HTTPS({ trustProtoHeader: true }));
app.use('/user', UserRouter_1.default);
app.use('/accounts', BankAccountRouter_1.default);
app.use('/transactions', TransactionRouter_1.default);
app.use(errorHandler);
(0, DatabaseUtils_1.connectToMongo)();
app.listen(port, () => {
    console.log(`xdd`);
});
