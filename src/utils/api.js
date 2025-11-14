import {FINNHUB_API_KEY, FINNHUB_BASE, COINGECKO_BASE, CRYPTO_ID_MAP, POPULAR_ASSETS, CACHE_TTL} from '../constants';

const cache = new Map();

// Helper function to calculate price ranges from historical data
const calculateRange = (dataArray, days) => {
    const slice = days > 0 ? dataArray.slice(-days) : dataArray;
    return {
        low: Math.min(...slice),
        high: Math.max(...slice),
    };
};

const fetchFromFinnhub = async (endpoint, params = {}) => {
    const queryString = new URLSearchParams({ token: FINNHUB_API_KEY, ...params }).toString();
    const cacheKey = `${endpoint}?${queryString}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    try {
        const response = await fetch(`${FINNHUB_BASE}${endpoint}?${queryString}`);
        const data = await response.json();

        // Check for errors
        if (data.error) {
            console.warn('Finnhub API Error:', data.error);
            return { _error: true, message: data.error };
        }

        cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
    } catch (error) {
        console.error('API Error:', error);
        return { _error: true, message: error.message };
    }
};

export const searchSymbols = async (keywords) => {
    const lowerKeywords = keywords.toLowerCase();
    const popularMatches = POPULAR_ASSETS.filter(asset =>
        asset.symbol.toLowerCase().includes(lowerKeywords) || asset.name.toLowerCase().includes(lowerKeywords)
    );

    if (popularMatches.length > 0) return popularMatches;

    const data = await fetchFromFinnhub('/search', { q: keywords });

    if (data._error || !data.result) return [];

    return data.result.slice(0, 10).map(match => ({
        symbol: match.symbol,
        name: match.description,
        type: 'stock',
        exchange: match.type,
    }));
};

export const getGlobalQuote = async (symbol) => {
    const data = await fetchFromFinnhub('/quote', { symbol });

    if (data?._error) {
        console.error(`API Error for ${symbol}:`, data.message);
        return null;
    }

    // Finnhub response: {c: current, d: change, dp: percent change, h: high, l: low, o: open, pc: previous close}
    if (data && data.c) {
        return {
            price: data.c || 0,
            change: data.d || 0,
            changePercent: data.dp || 0,
            high: data.h || 0,
            low: data.l || 0,
            open: data.o || 0,
            previousClose: data.pc || 0,
        };
    }
    return null;
};

export const getCryptoQuote = async (symbol) => {
    // Use CoinGecko API (free, no key required)
    const coinId = CRYPTO_ID_MAP[symbol];
    if (!coinId) {
        console.warn(`Unknown crypto symbol: ${symbol}`);
        return null;
    }

    const cacheKey = `coingecko-${coinId}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    try {
        const response = await fetch(
            `${COINGECKO_BASE}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`
        );
        const data = await response.json();

        if (!data[coinId]) {
            console.error(`No data for ${symbol} (${coinId})`);
            return null;
        }

        const price = data[coinId].usd;
        const changePercent = data[coinId].usd_24h_change || 0;
        const change = price * (changePercent / 100);

        const result = {
            price,
            change,
            changePercent,
        };

        cache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
    } catch (error) {
        console.error(`Error fetching crypto quote for ${symbol}:`, error);
        return null;
    }
};

export const getDailyData = async (symbol) => {
    try {
        const now = Math.floor(Date.now() / 1000);
        const oneYearAgo = now - (365 * 24 * 60 * 60);

        const data = await fetchFromFinnhub('/stock/candle', {
            symbol,
            resolution: 'D',
            from: oneYearAgo,
            to: now,
        });

        if (data?._error || data?.s === 'no_data' || !data?.h || !data?.l) {
            console.warn(`No daily data for ${symbol}`);
            return null;
        }

        // Combine highs and lows for overall range
        const allPrices = [...data.h, ...data.l];

        return {
            day: calculateRange(allPrices.slice(-2), 0),    // Last day
            month: calculateRange(allPrices.slice(-60), 0),  // Last 30 days (2 prices/day)
            year: calculateRange(allPrices, 0),              // All year data
            alltime: calculateRange(allPrices, 0),
        };
    } catch (error) {
        console.error(`Error fetching daily data for ${symbol}:`, error);
        return null;
    }
};

export const getCryptoData = async (symbol) => {
    try {
        const coinId = CRYPTO_ID_MAP[symbol];
        if (!coinId) {
            console.warn(`Unknown crypto symbol: ${symbol}`);
            return null;
        }

        // Get market chart data for 1 year
        const response = await fetch(
            `${COINGECKO_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=365`
        );
        const data = await response.json();

        if (!data.prices || data.prices.length === 0) {
            console.warn(`No historical data for ${symbol}`);
            return null;
        }

        // data.prices is an array of [timestamp, price]
        const prices = data.prices.map(p => p[1]);

        return {
            day: calculateRange(prices, 1),
            month: calculateRange(prices, 30),
            year: calculateRange(prices, 365),
            alltime: calculateRange(prices, 0),
        };
    } catch (error) {
        console.error(`Error fetching crypto data for ${symbol}:`, error);
        return null;
    }
};
