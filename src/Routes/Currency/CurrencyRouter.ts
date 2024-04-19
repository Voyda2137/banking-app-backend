import {Router} from "express";
import {getUserFromJwt} from "../../Utils/UserUtils/GeneralUtils";
import moment from "moment";
import {calculateExchangeRateChangePercentage} from "../../Utils/CurrencyUtils/CurrencyUtils";
import passport from "../../Utils/UserUtils/Authorizer";
import {ApiUrlCurrency} from "../../models/CurrencyInterface";


const currencyRouter = Router();


const API_URL = (date: string, hour: string) => `https://cdn.jsdelivr.net/gh/ismartcoding/currency-api@main/${date}/${hour}.json`;

currencyRouter.get('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try {
        const user = await getUserFromJwt(req.header('Authorization'));
        if (!user) throw new Error('Could not verify user');

        const dateToday = moment().format('YYYY-MM-DD');
        const dateYesterday = moment().subtract(1, 'd').format('YYYY-MM-DD');
        const hour = moment().subtract(6, 'h').format("HH");

        const currenciesTomorrow = await fetch(API_URL(dateYesterday, hour)).then(response => response.json());
        const currenciesToday = await fetch(API_URL(dateToday, hour)).then(response => response.json());

        const changes = calculateExchangeRateChangePercentage(currenciesTomorrow, currenciesToday);
        const filteredCurrencies = changes.filter((exchangeRate) => exchangeRate.currency.toLowerCase().includes(String(req.query.q).toLowerCase()));

        return res.status(200).json({
            success: true,
            message: 'Successfully retrieved currencies',
            changes: {
                tsToday: currenciesToday.ts,
                tsTomorrow: currenciesTomorrow.ts,
                base: currenciesToday.base,
                quotes: req.query.q ? filteredCurrencies : changes
            },
        });
    } catch (e) {
        next(e);
    }
})


export default currencyRouter