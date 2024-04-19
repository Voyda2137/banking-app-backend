import {Router} from "express";
import {getUserFromJwt} from "../../Utils/UserUtils/GeneralUtils";
import moment from "moment";
import {calculateExchangeRateChangePercentage} from "../../Utils/CurrencyUtils/CurrencyUtils";
import passport from "../../Utils/UserUtils/Authorizer";
import {ApiUrlCurrency} from "../../models/CurrencyInterface";


const currencyRouter = Router();


const API_URL = ({date, hour}: ApiUrlCurrency) => `${process.env.CURRENCY_API_URL || "https://cdn.jsdelivr.net/gh/ismartcoding/currency-api@main"}/${date}/${hour}.json`

currencyRouter.get('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try {
        const authHeader: string | undefined = req.header('Authorization')

        const user = await getUserFromJwt(authHeader)
        if (!user) {
            throw new Error('Could not verify user')
        }

        const currenciesTomorrow = await fetch(API_URL({
            date: moment().subtract(1, 'd').format('YYYY-MM-DD'),
            hour: moment().subtract(6, 'h').format("HH")
        })).then(response => response.json())

        const currenciesToday = await fetch(API_URL({
            date: moment().format('YYYY-MM-DD'),
            hour: moment().subtract(6, 'h').format("HH")
        })).then(response => response.json())

        const changes = calculateExchangeRateChangePercentage(currenciesTomorrow, currenciesToday)

        return res.status(200).json({
            success: true,
            message: 'Successfully retrieved currencies',
            changes,
            currenciesToday,
            currenciesTomorrow
        })
    } catch (e) {
        next(e)
    }
})


export default currencyRouter