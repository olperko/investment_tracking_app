import React, { useCallback, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SearchBar from '../components/SearchBar';
import PortfolioSection from '../components/PortfolioSection';
import AddSavingsModal from '../components/AddSavingsModal';
import SavingsDetailModal from '../components/SavingsDetailModal';
import { generateChartData } from '../utils/helpers';

const PortfolioScreen = ({ portfolio, setPortfolio, assetData, setAssetData, onAddAsset, setSelectedAssetGroup, setShowSellModal }) => {
    const [showAddSavingsModal, setShowAddSavingsModal] = useState(false);
    const [selectedSavingsItem, setSelectedSavingsItem] = useState(null);
    const [savingsLoading, setSavingsLoading] = useState(false);

    const handleAddSavings = useCallback((savings) => {
        if (!savings) return;
        try {
            setPortfolio(prev => [...prev, { id: Date.now(), asset: savings }]);
            setShowAddSavingsModal(false);
        } catch (err) {
            console.error('Error adding savings:', err);
        }
    }, [setPortfolio]);

    const handleSavingsEdit = useCallback((updatedSavings) => {
        if (!updatedSavings) return;
        try {
            setPortfolio(prev =>
                prev.map(item => item.asset.id === updatedSavings.id ? { ...item, asset: updatedSavings } : item)
            );
            setSelectedSavingsItem(null);
        } catch (err) {
            console.error('Error editing savings:', err);
        }
    }, [setPortfolio]);

    const handleSavingsDelete = useCallback((id) => {
        if (!id) return;
        try {
            setPortfolio(prev => prev.filter(item => item.asset.id !== id));
            setSelectedSavingsItem(null);
        } catch (err) {
            console.error('Error deleting savings:', err);
        }
    }, [setPortfolio]);

    const handleAssetClick = useCallback((group) => {
        if (group) setSelectedAssetGroup(group);
    }, [setSelectedAssetGroup]);

    const handleViewSavingsDetail = useCallback((item) => {
        if (item && item.asset) {
            setSelectedSavingsItem(item);
        }
    }, []);

    const handleSellClick = useCallback(() => setShowSellModal(true), [setShowSellModal]);

    const chartData = generateChartData(portfolio, assetData);

    const stocks = portfolio.filter(item => item && item.asset && item.asset.type === 'stock');
    const cryptos = portfolio.filter(item => item && item.asset && item.asset.type === 'crypto');
    const savingsItems = portfolio.filter(item => item && item.asset && item.asset.type === 'savings');

    return (
        <div>
            <SearchBar onAddAsset={onAddAsset} />

            <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '1.5rem', border: '2px solid #3b82f6', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>Portfolio Overview</h3>
                <div style={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #334155' }}>
                    {chartData && chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={150}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '2px solid #3b82f6', borderRadius: '0.5rem' }} />
                                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Add assets to see chart</p>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', width: '100%', flexWrap: 'wrap' }}>
                <PortfolioSection
                    title="Stocks"
                    items={stocks}
                    onAssetClick={handleAssetClick}
                    assetData={assetData}
                    onSellClick={handleSellClick}
                />
                <PortfolioSection
                    title="Crypto"
                    items={cryptos}
                    onAssetClick={handleAssetClick}
                    assetData={assetData}
                    onSellClick={handleSellClick}
                />
                <PortfolioSection
                    title="Savings"
                    items={savingsItems}
                    onAssetClick={handleViewSavingsDetail}
                    assetData={assetData}
                    onNewSavingsClick={() => setShowAddSavingsModal(true)}
                />
            </div>

            {showAddSavingsModal && (
                <AddSavingsModal
                    onClose={() => setShowAddSavingsModal(false)}
                    onConfirm={handleAddSavings}
                    loading={savingsLoading}
                />
            )}

            {selectedSavingsItem && !selectedSavingsItem.isEditing && (
                <SavingsDetailModal
                    savings={selectedSavingsItem.asset}
                    onClose={() => setSelectedSavingsItem(null)}
                    onEdit={() => setSelectedSavingsItem({ ...selectedSavingsItem, isEditing: true })}
                    onDelete={handleSavingsDelete}
                />
            )}

            {selectedSavingsItem && selectedSavingsItem.isEditing && (
                <AddSavingsModal
                    initialSavings={selectedSavingsItem.asset}
                    onClose={() => setSelectedSavingsItem(null)}
                    onConfirm={handleSavingsEdit}
                    loading={savingsLoading}
                />
            )}
        </div>
    );
};

export default PortfolioScreen;
