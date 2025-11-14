import React from 'react';
import { Plus } from 'lucide-react';
import { usePortfolioTotals } from '../utils/helpers';

const PortfolioSection = ({ title, items, onAssetClick, assetData, onNewSavingsClick }) => {
    const { total: sectionTotal, changePercent: sectionChange } = usePortfolioTotals(items, assetData);
    const isPositive = sectionChange >= 0;

    const grouped = items.reduce((acc, item) => {
        if (item.asset.type === 'savings') {
            const name = item.asset.name || 'Savings Account';
            if (!acc[name]) acc[name] = { items: [], totalQty: 0, totalVal: 0, id: item.id, asset: item.asset };
            acc[name].items.push(item);
            acc[name].totalVal += item.asset.amount || 0;
            acc[name].totalQty += 1;

            return acc;
        }
        const symbol = item.asset.symbol;
        if (!acc[symbol]) acc[symbol] = { items: [], totalQty: 0, totalVal: 0 };
        const cacheKey = `${symbol}-${item.asset.type}`;
        const data = assetData[cacheKey];
        const price = data?.quote?.price || 0;

        acc[symbol].items.push(item);
        acc[symbol].totalQty += item.quantity;
        acc[symbol].totalVal += price * item.quantity;

        return acc;
    }, {});

    return (
        <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#1e293b', borderRadius: '1rem', padding: '1.5rem', border: '2px solid #3b82f6' }}>
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '2px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>{title}</h2>
                    {title === 'Savings' && onNewSavingsClick && (
                        <button
                            onClick={onNewSavingsClick}
                            style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                            <Plus size={16} /> New
                        </button>
                    )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#3b82f6' }}>${sectionTotal.toFixed(2)}</p>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Value</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '1rem', fontWeight: '600', color: isPositive ? '#10b981' : '#ef4444' }}>
                            {isPositive ? '+' : ''}{sectionChange.toFixed(2)}%
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>24h Change</p>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.length === 0 ? (
                    <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>No {title.toLowerCase()} yet</p>
                ) : (
                    Object.entries(grouped).map(([key, group]) => {
                        const firstItem = group.items[0];
                        const isSavings = firstItem.asset.type === 'savings';
                        const groupType = isSavings ? 'savings' : firstItem.asset.type;
                        const groupData = isSavings ? {} : assetData[`${firstItem.asset.symbol}-${groupType}`];
                        return (
                            <div
                                key={key}
                                onClick={() => {
                                    if (isSavings) {
                                        onAssetClick(group.items[0]);
                                    } else {
                                        onAssetClick({ symbol: key, items: group.items, data: groupData || {} });
                                    }
                                }}
                                style={{
                                    backgroundColor: '#0f172a',
                                    borderRadius: '0.5rem',
                                    padding: '1rem',
                                    border: isSavings ? '1px solid #10b981' : '1px solid #334155',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#1e293b';
                                    e.currentTarget.style.borderColor = isSavings ? '#10b981' : '#3b82f6';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#0f172a';
                                    e.currentTarget.style.borderColor = isSavings ? '#10b981' : '#334155';
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ fontWeight: '600', color: 'white', marginBottom: '0.25rem' }}>
                                            {isSavings ? key : firstItem.asset.symbol}
                                        </h3>
                                        <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                                            {isSavings ? `Rate: ${firstItem.asset.rate}% APY` : firstItem.asset.name}
                                        </p>
                                        <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: isSavings ? '#10b981' : '#3b82f6', marginTop: '0.5rem' }}>
                                            ${group.totalVal.toFixed(2)}
                                        </p>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                        {isSavings ? `Total: $${group.totalVal.toFixed(2)}` : `${group.totalQty.toFixed(4)} units`}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default PortfolioSection;
