import {useMemo} from 'react';

export const usePortfolioTotals = (portfolio, assetData) => useMemo(() => {
    if (!portfolio || portfolio.length === 0) {
        return { stocks: 0, crypto: 0, savings: 0, total: 0, changePercent: 0 };
    }

    const totals = { stocks: 0, crypto: 0, savings: 0, total: 0, changePercent: 0 };
    let totalDollarChange = 0;

    portfolio.forEach(item => {
        if (!item?.asset) return;

        if (item.asset.type === 'savings') {
            const amount = item.asset.amount || 0;
            totals.savings += amount;
            totals.total += amount;
            return;
        }

        const cacheKey = `${item.asset.symbol}-${item.asset.type}`;
        const data = assetData[cacheKey];
        if (data?.quote) {
            const value = (data.quote.price || 0) * (item.quantity || 0);
            totals.total += value;

            if (item.asset.type === 'stock') totals.stocks += value;
            else if (item.asset.type === 'crypto') totals.crypto += value;

            const changePercent = data.quote.changePercent || 0;
            totalDollarChange += value * (changePercent / 100);
        }
    });

    totals.changePercent = totals.total > 0 ? (totalDollarChange / totals.total) * 100 : 0;
    return totals;
}, [portfolio, assetData]);

// Generate simulated historical chart data
export const generateChartData = (portfolio, assetData) => {
    if (!portfolio || portfolio.length === 0) return [];

    const data = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        const currentValue = portfolio.reduce((sum, item) => {
            if (item.asset.type === 'savings') {
                return sum + (item.asset.amount || 0);
            }

            const cacheKey = `${item.asset.symbol}-${item.asset.type}`;
            const price = assetData[cacheKey]?.quote?.price || 0;
            return sum + (price * (item.quantity || 0));
        }, 0);

        const safeCurrentValue = Math.max(0, currentValue);
        const variance = Math.sin(i * 0.5) * 0.05 + (Math.random() - 0.5) * 0.03;
        const historicalValue = Math.max(0, safeCurrentValue * (1 + variance - (i * 0.001)));

        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: historicalValue,
        });
    }
    return data;
};
