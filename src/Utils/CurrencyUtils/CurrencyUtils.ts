import {Currency} from "../../models/CurrencyInterface";


export const calculateExchangeRateChangePercentage = (oldExchangeRate: Currency, newExchangeRate: Currency) => {
    const todayQuotes = newExchangeRate.quotes;
    const tomorrowQuotes = oldExchangeRate.quotes;

    const changes: { currency: string, change: number, oldRate: number, newRate: number }[] = [];

    for (const currency in todayQuotes) {
        if (todayQuotes.hasOwnProperty(currency) && tomorrowQuotes.hasOwnProperty(currency)) {
            const currentRate = todayQuotes[currency];
            const oldRate = tomorrowQuotes[currency];
            const change = Number((((currentRate - oldRate) / oldRate) * 100).toFixed(4));

            changes.push({
                currency,
                oldRate,
                newRate: currentRate,
                change
            });
        }
    }

    return changes;
}
