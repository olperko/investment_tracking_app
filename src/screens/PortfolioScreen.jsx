import React, { useCallback, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SearchBar from '../components/SearchBar';
import PortfolioSection from '../components/PortfolioSection';
import AddSavingsModal from '../components/AddSavingsModal';
import SavingsDetailModal from '../components/SavingsDetailModal';
import { getCryptoQuote, getGlobalQuote, getCryptoData, getDailyData } from '../utils/api';
import { generateChartData } from '../utils/helpers';

const PortfolioScreen = ({ portfolio, setPortfolio, assetData, setAssetData, onAddAsset, setSelectedAssetGroup, setShowSellModal }) => {

    const [showAddSavingsModal, setShowAddSavingsModal] = useState(false);
    const [selectedSavingsItem, setSelectedSavingsItem] = useState(null);

    const loadAssetData = useCallback(async (asset) => {
        const cacheKey = `${asset.symbol}-${asset.type}`;

        if (assetData[cacheKey]) return;

        const quoteData = asset.type === 'crypto' ? await getCryptoQuote(asset.symbol) : await getGlobalQuote(asset.symbol);
        const priceData = asset.type === 'crypto' ? await getCryptoData(asset.symbol) : await getDailyData(asset.symbol);

        setAssetData(prev => ({ ...prev, [cacheKey]: { quote: quoteData || { price: 0, change: 0, changePercent: 0 }, price: priceData || {} } }));
    }, [assetData, setAssetData]);

    const handleAddAsset = useCallback(async (asset) => {

        await loadAssetData(asset);
        onAddAsset(asset);
    }, [loadAssetData, onAddAsset]);

    const handleAddSavings = useCallback((savings) => {

        setPortfolio(prev => [...prev, { id: Date.now(), asset: savings }]);
        setShowAddSavingsModal(false);
    }, [setPortfolio]);

    const handleSavingsEdit = useCallback((updatedSavings) => {

        setPortfolio(prev => prev.map(item => item.id === updatedSavings.id ? { ...item, asset: updatedSavings } : item));
        setSelectedSavingsItem(null);
    }, [setPortfolio]);

    const handleSavingsDelete = useCallback((id) => {

        setPortfolio(prev => prev.filter(item => item.id !== id));
        setSelectedSavingsItem(null);
    }, [setPortfolio]);

    const handleAssetClick = useCallback((group) => setSelectedAssetGroup(group), [setSelectedAssetGroup]);

    const handleViewSavingsDetail = useCallback((item) => {

        setSelectedSavingsItem(item);
    }, []);

    const handleSellClick = useCallback(() => setShowSellModal(true), [setShowSellModal]);

    const chartData = generateChartData(portfolio, assetData);

    const stocks = portfolio.filter(item => item.asset.type === 'stock');
    const cryptos = portfolio.filter(item => item.asset.type === 'crypto');
    const savingsItems = portfolio.filter(item => item.asset.type === 'savings');

    return (
        <div>
            <SearchBar onAddAsset={handleAddAsset} />

            <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '1.5rem', border: '2px solid #3b82f6', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>Portfolio Overview</h3>
                <div style={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #334155' }}>
                    <ResponsiveContainer width="100%" height={150}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                            <YAxis stroke="#64748b" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '2px solid #3b82f6', borderRadius: '0.5rem' }} />
                            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
                <PortfolioSection title="Stocks" items={stocks} onAssetClick={handleAssetClick} assetData={assetData} setPortfolio={setPortfolio} onSellClick={handleSellClick} />
                <PortfolioSection title="Crypto" items={cryptos} onAssetClick={handleAssetClick} assetData={assetData} setPortfolio={setPortfolio} onSellClick={handleSellClick} />
                <PortfolioSection
                    title="Savings"
                    items={savingsItems}
                    onAssetClick={handleViewSavingsDetail}
                    assetData={assetData}
                    setPortfolio={setPortfolio}
                    onNewSavingsClick={() => setShowAddSavingsModal(true)}
                />
            </div>

            {showAddSavingsModal && (
                <AddSavingsModal
                    onClose={() => setShowAddSavingsModal(false)}
                    onConfirm={handleAddSavings}
                    loading={false}
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
                    loading={false}
                />
            )}
        </div>
    );
};

export default PortfolioScreen;
