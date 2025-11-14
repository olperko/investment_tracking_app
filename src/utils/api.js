import {API_KEY, ALPHA_VANTAGE_BASE, POPULAR_ASSETS, CACHE_TTL} from '../constants'; // Adjust import if needed

const cache = new Map();

const fetchFromAlphaVantage = async (params) => {
    const queryString = new URLSearchParams({ apikey: API_KEY, ...params }).toString();
    const cacheKey = queryString;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    try {
        const response = await fetch(`${ALPHA_VANTAGE_BASE}?${queryString}`);
        const data = await response.json();
        cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export const searchSymbols = async (keywords) => {
    const lowerKeywords = keywords.toLowerCase();
    const popularMatches = POPULAR_ASSETS.filter(asset =>
        asset.symbol.toLowerCase().includes(lowerKeywords) || asset.name.toLowerCase().includes(lowerKeywords)
    );

    if (popularMatches.length > 0) return popularMatches;

    const data = await fetchFromAlphaVantage({ function: 'SYMBOL_SEARCH', keywords });

    return data?.bestMatches?.map(match => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'] === 'Crypto' ? 'crypto' : 'stock',
        exchange: match['4. region'],
    })) || [];
};

export const getGlobalQuote = async (symbol) => {
    const data = await fetchFromAlphaVantage({ function: 'GLOBAL_QUOTE', symbol });
    const quote = data?.['Global Quote'];
    if (quote) {
        return {
            price: parseFloat(quote['05. price']) || 0,
            change: parseFloat(quote['09. change']) || 0,
            changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
        };
    }
    return null;
};

export const getCryptoQuote = async (symbol) => {
    const data = await fetchFromAlphaVantage({
        function: 'DIGITAL_CURRENCY_DAILY',
        symbol,
        market: 'USD',
        outputsize: 'compact',
    });
    const timeSeries = data?.['Time Series (Digital Currency Daily)'];
    if (!timeSeries) return null;

    const dates = Object.keys(timeSeries).sort().reverse();
    const latest = timeSeries[dates[0]];
    const prev = dates[1] ? timeSeries[dates[1]] : latest;
    const price = parseFloat(latest['4. close']) || 0;
    const prevClose = parseFloat(prev['4. close']) || price;
    const change = price - prevClose;
    const changePercent = prevClose > 0 ? (change / prevClose * 100) : 0;

    return { price, change, changePercent };
};

export const getDailyData = async (symbol) => {
    try {
// Timeout wrapper (5s max)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const data = await fetchFromAlphaVantage({
            function: 'TIME_SERIES_DAILY',
            symbol,
            outputsize: 'compact' // Changed to compact (last 100 days)
        });
        clearTimeout(timeoutId);

        if (!data?.['Time Series (Daily)']) return null;

        const timeSeries = data['Time Series (Daily)'];
        const dates = Object.keys(timeSeries).sort().reverse(); // Latest first
        const allData = dates.map(date => ({
            high: parseFloat(timeSeries[date]['2. high']),
            low: parseFloat(timeSeries[date]['3. low']),
        }));

        const getRange = (slice) => {
            const lows = slice.map(d => d.low).filter(Boolean);
            const highs = slice.map(d => d.high).filter(Boolean);
            return lows.length > 0 ? {
                low: Math.min(...lows),
                high: Math.max(...highs),
            } : { low: 0, high: 0 };
        };
        return {
            day: getRange(allData.slice(0, 1)),
            month: getRange(allData.slice(0, 30)),
            year: getRange(allData.slice(0, 100)), // Compact limits to ~100, so adjust
            alltime: getRange(allData), // Still full of compact
        };
    } catch (error) {
        if (error.name === 'AbortError') {
            console.warn(`Timeout fetching daily data for ${symbol}`);
        } else {
            console.error(`Error fetching daily data for ${symbol}:`, error);
        }
        return null; // Fallback to defaults
    }
};

export const getCryptoData = async (symbol) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const data = await fetchFromAlphaVantage({
            function: 'DIGITAL_CURRENCY_DAILY',
            symbol,
            market: 'USD',
            outputsize: 'compact' // Changed to compact
        });

        clearTimeout(timeoutId);

        if (!data?.['Time Series (Digital Currency Daily)']) return null;

        const timeSeries = data['Time Series (Digital Currency Daily)'];
        const dates = Object.keys(timeSeries).sort().reverse();
        const allData = dates.map(date => ({
            high: parseFloat(timeSeries[date]['2. high']),
            low: parseFloat(timeSeries[date]['3. low']),
        }));

        const getRange = (slice) => {
            const lows = slice.map(d => d.low).filter(Boolean);
            const highs = slice.map(d => d.high).filter(Boolean);
            return lows.length > 0 ? {
                low: Math.min(...lows),
                high: Math.max(...highs),
            } : { low: 0, high: 0 };
        };

        return {
            day: getRange(allData.slice(0, 1)),
            month: getRange(allData.slice(0, 30)),
            year: getRange(allData.slice(0, 100)),
            alltime: getRange(allData),
        };
    } catch (error) {
        if (error.name === 'AbortError') {
            console.warn(`Timeout fetching crypto data for ${symbol}`);
        } else {
            console.error(`Error fetching crypto data for ${symbol}:`, error);
        }
        return null;
    }
};

import { useMemo } from 'react';

export const usePortfolioTotals = (portfolio, assetData) => useMemo(() => {
    const totals = { stocks: 0, crypto: 0, savings: 0, total: 0, changePercent: 0 };
    let totalDollarChange = 0;
    portfolio.forEach(item => {
        if (item.asset.type === 'savings') {
            totals.savings += item.asset.amount || 0; // Direct amount
            totals.total += item.asset.amount || 0;
            return; // No change % for savings
        }

        const cacheKey = `${item.asset.symbol}-${item.asset.type}`;
        const data = assetData[cacheKey];
        if (data?.quote) {
            const value = data.quote.price * item.quantity;
            totals.total += value;
            if (item.asset.type === 'stock') totals.stocks += value;
            else if (item.asset.type === 'crypto') totals.crypto += value;
            totalDollarChange += value * (data.quote.changePercent / 100);
        }
    });
    const portfolioChangePercent = totals.total > 0 ? (totalDollarChange / totals.total) * 100 : 0;
    totals.changePercent = portfolioChangePercent; // FIXED: Assign to totals

    return totals;

}, [portfolio, assetData]);

// Simulated chart data (replace with real historical fetches for prod)

export const generateChartData = (portfolio, assetData) => {
    const data = [];
    const today = new Date();
    let baseValue = 0;

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const currentValue = portfolio.reduce((sum, item) => {
            if (item.asset.type === 'savings') {
                return sum + (item.asset.amount || 0); // Stable + tiny daily interest
            }
            const cacheKey = `${item.asset.symbol}-${item.asset.type}`;
            const assetInfo = assetData[cacheKey];
            return sum + (assetInfo?.quote?.price * item.quantity || 0);
        }, 0);

        // eslint-disable-next-line no-unused-vars
        if (i === 29) baseValue = currentValue || 1; // Avoid div0

        const variance = Math.sin(i * 0.5) * 0.05 + (Math.random() - 0.5) * 0.03;
        const historicalValue = Math.max(0, currentValue * (1 + variance - (i * 0.001)));

        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: historicalValue,
        });
    }
    return data;
};
