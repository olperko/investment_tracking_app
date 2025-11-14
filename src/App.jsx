import React, { useState, useEffect, useCallback } from 'react';
import AddAssetModal from './components/AddAssetModal';
import SellModal from './components/SellModal';
import Navigation from './components/Navigation';
import AssetDetailModal from './components/AssetDetailModal';
import PortfolioScreen from './screens/PortfolioScreen.jsx';
import AnalyticsScreen from './screens/AnalyticsScreen';
import SettingsScreen from './screens/SettingsScreen';
import { getCryptoQuote, getGlobalQuote, getCryptoData, getDailyData } from './utils/api';


const App = () => {

    const [portfolio, setPortfolio] = useState(() => JSON.parse(localStorage.getItem('portfolio') || '[]'));
    const [assetData, setAssetData] = useState(() => JSON.parse(localStorage.getItem('assetData') || '{}'));
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [loadingModal] = useState(false);
    const [selectedAssetGroup, setSelectedAssetGroup] = useState(null);
    const [showSellModal, setShowSellModal] = useState(false);
    const [currentScreen, setCurrentScreen] = useState('portfolio');

    useEffect(() => { localStorage.setItem('portfolio', JSON.stringify(portfolio)); }, [portfolio]);
    useEffect(() => { localStorage.setItem('assetData', JSON.stringify(assetData)); }, [assetData]);

    const loadAssetData = useCallback(async (asset) => {
        const cacheKey = `${asset.symbol}-${asset.type}`;
        if (assetData[cacheKey]) return;

        const quoteData = asset.type === 'crypto' ? await getCryptoQuote(asset.symbol) : await getGlobalQuote(asset.symbol);
        const priceData = asset.type === 'crypto' ? await getCryptoData(asset.symbol) : await getDailyData(asset.symbol);

        setAssetData(prev => ({
            ...prev,
            [cacheKey]: {
                quote: quoteData || { price: 0, change: 0, changePercent: 0 },
                price: priceData || {}
            }
        }))
    }, [assetData, setAssetData]);

    const handleAddAsset = useCallback(async (asset) => {
        setSelectedAsset(asset);
        setShowAddModal(true);
        loadAssetData(asset).catch(err => {
            console.error('Failed to load asset data:', err);
        });
    }, [loadAssetData]);

    const handleConfirmAdd = useCallback((quantity) => {
        setPortfolio(prev => [...prev, { id: Date.now(), asset: selectedAsset, quantity }]);
        setShowAddModal(false);
    }, [selectedAsset]);

    const handleSell = useCallback((entryIndex, qty) => {
        const entry = selectedAssetGroup.items[entryIndex];
        if (qty >= entry.quantity) {
            setPortfolio(prev => prev.filter(item => item.id !== entry.id));
        } else {
            setPortfolio(prev => prev.map(item => item.id === entry.id ? { ...item, quantity: item.quantity - qty } : item));
        }
        setShowSellModal(false);
        setSelectedAssetGroup(null);
    }, [selectedAssetGroup]);

    const renderScreen = () => {
        switch (currentScreen) {
            case 'portfolio': return (
                <PortfolioScreen
                    portfolio={portfolio}
                    setPortfolio={setPortfolio}
                    assetData={assetData}
                    setAssetData={setAssetData}
                    onAddAsset={handleAddAsset}
                    setSelectedAssetGroup={setSelectedAssetGroup}
                    setShowSellModal={setShowSellModal}
                />
            );
            case 'analytics': return <AnalyticsScreen portfolio={portfolio} assetData={assetData} />;
            case 'settings': return <SettingsScreen portfolio={portfolio} setPortfolio={setPortfolio} />;
            default: return null;
        }
    };
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', paddingBottom: '4rem' }}>
            <header style={{ backgroundColor: '#1e293b', borderBottom: '3px solid #3b82f6', padding: '2rem 1rem', marginBottom: '2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        💼 Portfolio Master
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Track stocks, crypto, savings</p>
                </div>
            </header>
            <Navigation currentScreen={currentScreen} onScreenChange={setCurrentScreen} />
            <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
                {renderScreen()}
            </main>
            {showAddModal && selectedAsset && <AddAssetModal asset={selectedAsset} onClose={() => setShowAddModal(false)} onConfirm={handleConfirmAdd} loading={loadingModal} />}
            {showSellModal && selectedAssetGroup && <SellModal assetGroup={selectedAssetGroup} onClose={() => setShowSellModal(false)} onSell={handleSell} loading={loadingModal} />}
            {selectedAssetGroup && <AssetDetailModal
                group={selectedAssetGroup}
                onClose={() => setSelectedAssetGroup(null)}
                onBuy={handleAddAsset}
                onSell={() => setShowSellModal(true)}
            />}
        </div>
    );
};

export default App;
