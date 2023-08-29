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
const httpsEnforcer = (req, res, next) => {
    if (req.header('x-forwarded-proto') !== undefined && req.header('x-forwarded-proto') !== 'https') {
        if (req.header('host') !== 'localhost') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        }
    }
    else {
        next();
    }
};
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    console.log('bledzik');
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        success: false,
        message: err.message
    });
};
// app.use(httpsEnforcer)
app.use(express_1.default.json());
app.use(Authorizer_1.default.initialize());
app.use(cors({ credentials: true, origin: ['http://localhost:2137', 'https://mg-banking.pl'] }));
// app.use(enforce.HTTPS({trustProtoHeader: true}))
app.use('/user', UserRouter_1.default);
app.use('/accounts', BankAccountRouter_1.default);
app.use('/transactions', TransactionRouter_1.default);
app.use(errorHandler);
(0, DatabaseUtils_1.connectToMongo)();
app.listen(port, () => {
    console.log(`xdd`);
});
