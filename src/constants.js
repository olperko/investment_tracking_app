export const POPULAR_ASSETS = [
    { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stock' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'stock' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'stock' },
    { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock' },
    { symbol: 'META', name: 'Meta Platforms Inc.', type: 'stock' },
    { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc.', type: 'stock' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', type: 'stock' },
    { symbol: 'V', name: 'Visa Inc.', type: 'stock' },
    { symbol: 'WMT', name: 'Walmart Inc.', type: 'stock' },
    { symbol: 'DIS', name: 'The Walt Disney Company', type: 'stock' },
    { symbol: 'PG', name: 'Procter & Gamble Co.', type: 'stock' },
    { symbol: 'BA', name: 'The Boeing Company', type: 'stock' },
    { symbol: 'NFLX', name: 'Netflix Inc.', type: 'stock' },
    { symbol: 'BTC', name: 'Bitcoin', type: 'crypto' },
    { symbol: 'ETH', name: 'Ethereum', type: 'crypto' },
    { symbol: 'BNB', name: 'Binance Coin', type: 'crypto' },
    { symbol: 'XRP', name: 'Ripple', type: 'crypto' },
    { symbol: 'ADA', name: 'Cardano', type: 'crypto' },
    { symbol: 'SOL', name: 'Solana', type: 'crypto' },
    { symbol: 'DOT', name: 'Polkadot', type: 'crypto' },
    { symbol: 'DOGE', name: 'Dogecoin', type: 'crypto' },
    { symbol: 'LINK', name: 'Chainlink', type: 'crypto' },
    { symbol: 'LTC', name: 'Litecoin', type: 'crypto' },
];

export const SAVINGS_PRESETS = [
    { id: 'varo', name: 'Varo Bank High-Yield', rate: 5.00, apy: true },
    { id: 'adel', name: 'AdelFi Savings', rate: 5.00, apy: true },
    { id: 'first', name: 'First Bank of the Lake', rate: 4.36, apy: true },
    { id: 'newtek', name: 'Newtek Bank', rate: 4.35, apy: true },
    { id: 'custom', name: 'Custom Rate', rate: 4.50, apy: true }, // Default
];


export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in ms
export const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
export const FINNHUB_BASE = 'https://finnhub.io/api/v1';
export const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

// Map crypto symbols to CoinGecko IDs
export const CRYPTO_ID_MAP = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'BNB': 'binancecoin',
    'XRP': 'ripple',
    'ADA': 'cardano',
    'SOL': 'solana',
    'DOT': 'polkadot',
    'DOGE': 'dogecoin',
    'LINK': 'chainlink',
    'LTC': 'litecoin',
};
