export interface CurrencyQuote {
    [key: string]: number
}

export interface Currency {
    ts: number;
    base: string;
    quotes: CurrencyQuote;
}

export interface ApiUrlCurrency {
    date: string,
    hour: string
}

export interface CalculatedExchangeRateChange {
    currency: string,
    change: number,
    oldRate: number,
    newRate: number
}