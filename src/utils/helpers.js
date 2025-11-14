import {useMemo} from 'react';

export const usePortfolioTotals = (portfolio, assetData) => useMemo(() => {
    const totals = { stocks: 0, crypto: 0, savings: 0, total: 0, changePercent: 0 };
    let totalDollarChange = 0;

    portfolio.forEach(item => {
        if (item.asset.type === 'savings') {
            totals.savings += item.asset.amount || 0;  // Direct amount
            totals.total += item.asset.amount || 0;
            return;  // No change % for savings
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

    totals.changePercent = totals.total > 0 ? (totalDollarChange / totals.total) * 100 : 0;  // FIXED: Assign to totals

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
                return sum + (item.asset.amount || 0);  // Stable + tiny daily interest
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
