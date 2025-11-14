import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { usePortfolioTotals, generateChartData } from '../utils/helpers';

const AnalyticsScreen = ({ portfolio, assetData }) => {
    const totals = usePortfolioTotals(portfolio, assetData);
    const chartData = generateChartData(portfolio, assetData);
    const stockValue = totals.stocks;
    const cryptoValue = totals.crypto;
    const savingsValue = totals.savings;

    const pieData = [
        { name: 'Stocks', value: stockValue, color: '#3b82f6' },
        { name: 'Crypto', value: cryptoValue, color: '#f59e0b' },
        { name: 'Savings', value: savingsValue, color: '#10b981' },
    ].filter(item => item.value > 0);

    const minValue = Math.min(...chartData.map(d => d.value));
    const maxValue = Math.max(...chartData.map(d => d.value));
    const change = minValue > 0 ? ((maxValue - minValue) / minValue * 100).toFixed(2) : 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '2rem', border: '2px solid #3b82f6' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>Portfolio Performance (30 Days)</h2>
                <div style={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #334155' }}>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="date" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: '2px solid #3b82f6' }} />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem' }}>
                    <div>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>30-Day Change</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: change >= 0 ? '#10b981' : '#ef4444' }}>
                            {change >= 0 ? '+' : ''}{change}%
                        </p>
                    </div>
                    <div>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Current Range</p>
                        <p style={{ fontSize: '1rem', color: '#3b82f6', fontWeight: '600' }}>${minValue.toFixed(2)} - ${maxValue.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div style={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', padding: '1.5rem', border: '2px solid #3b82f6' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Value</p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>${totals.total.toFixed(2)}</p>
                </div>
                <div style={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', padding: '1.5rem', border: '2px solid #10b981' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Stocks</p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>${stockValue.toFixed(2)}</p>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{((stockValue / totals.total * 100) || 0).toFixed(1)}%</p>
                </div>
                <div style={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', padding: '1.5rem', border: '2px solid #f59e0b' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Crypto</p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>${cryptoValue.toFixed(2)}</p>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{((cryptoValue / totals.total * 100) || 0).toFixed(1)}%</p>
                </div>
                {savingsValue > 0 && (
                    <div style={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', padding: '1.5rem', border: '2px solid #10b981' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Savings</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>${savingsValue.toFixed(2)}</p>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{((savingsValue / totals.total * 100) || 0).toFixed(1)}%</p>
                    </div>
                )}
            </div>
            {pieData.length > 0 && (
                <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '2rem', border: '2px solid #3b82f6' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>Asset Allocation</h2>
                    <div style={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #334155', display: 'flex', justifyContent: 'center' }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%" cy="50%" labelLine={false} outerRadius={100} dataKey="value"
                                    label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                                >
                                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: '2px solid #3b82f6' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '2rem', border: '2px solid #3b82f6' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>Holdings</h2>
                <div style={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #334155' }}>
                    {portfolio.length === 0 ? (
                        <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No holdings</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {portfolio.map((item) => {
                                const isSavings = item.asset.type === 'savings';
                                const value = isSavings ? (item.asset.amount || 0) : ((assetData[`${item.asset.symbol}-${item.asset.type}`]?.quote?.price || 0) * item.quantity);
                                return (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #334155', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ color: 'white', fontWeight: '600', marginBottom: '0.25rem' }}>
                                                {isSavings ? item.asset.name : item.asset.symbol}
                                            </p>
                                            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                                                {isSavings ? `Balance: $${(item.asset.amount || 0).toFixed(2)}` : `${item.quantity.toFixed(4)} @ ${(assetData[`${item.asset.symbol}-${item.asset.type}`]?.quote?.price || 0).toFixed(2)}`}
                                            </p>
                                        </div>
                                        <p style={{ color: isSavings ? '#10b981' : '#3b82f6', fontWeight: '600', fontSize: '1.125rem' }}>${value.toFixed(2)}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsScreen;
