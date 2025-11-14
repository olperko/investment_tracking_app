import React, { useState, useEffect, useCallback, useRef } from 'react';
import AddAssetModal from './components/AddAssetModal';
import SellModal from './components/SellModal';
import Navigation from './components/Navigation';
import AssetDetailModal from './components/AssetDetailModal';
import PortfolioScreen from './screens/PortfolioScreen.jsx';
import AnalyticsScreen from './screens/AnalyticsScreen';
import SettingsScreen from './screens/SettingsScreen';
import { getCryptoQuote, getGlobalQuote, getCryptoData, getDailyData } from './utils/api';

const App = () => {
    const [portfolio, setPortfolio] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('portfolio') || '[]');
        } catch (e) {
            console.error('Failed to parse portfolio:', e);
            return [];
        }
    });

    const [assetData, setAssetData] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('assetData') || '{}');
        } catch (e) {
            console.error('Failed to parse assetData:', e);
            return {};
        }
    });

    const [selectedAsset, setSelectedAsset] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [selectedAssetGroup, setSelectedAssetGroup] = useState(null);
    const [showSellModal, setShowSellModal] = useState(false);
    const [currentScreen, setCurrentScreen] = useState('portfolio');

    // Use a ref to track which assets are currently being loaded
    const loadingRef = useRef(new Set());

    // Persist portfolio to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('portfolio', JSON.stringify(portfolio));
        } catch (e) {
            console.error('Failed to save portfolio:', e);
        }
    }, [portfolio]);

    // Persist assetData to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('assetData', JSON.stringify(assetData));
        } catch (e) {
            console.error('Failed to save assetData:', e);
        }
    }, [assetData]);

    // Load asset data for a single asset
    const loadAssetData = useCallback(async (asset) => {
        if (!asset || !asset.symbol) return;

        const cacheKey = `${asset.symbol}-${asset.type}`;

        // Skip if already loaded (has actual price data)
        if (assetData[cacheKey]?.quote?.price > 0) return;

        // Skip if currently loading
        if (loadingRef.current.has(cacheKey)) return;

        loadingRef.current.add(cacheKey);
        setLoadingModal(true);

        try {
            const [quoteData, priceData] = await Promise.all([
                asset.type === 'crypto'
                    ? getCryptoQuote(asset.symbol)
                    : getGlobalQuote(asset.symbol),
                asset.type === 'crypto'
                    ? getCryptoData(asset.symbol)
                    : getDailyData(asset.symbol)
            ]);

            if (quoteData) {
                setAssetData(prev => ({
                    ...prev,
                    [cacheKey]: {
                        quote: quoteData,
                        price: priceData || {},
                        name: asset.name // Cache the asset name
                    }
                }));
            }
        } catch (err) {
            console.error(`Failed to load data for ${cacheKey}:`, err);
        } finally {
            loadingRef.current.delete(cacheKey);
            setLoadingModal(false);
        }
    }, [assetData]);

    // Load data for existing portfolio items on mount
    useEffect(() => {
        if (portfolio.length === 0) return;

        const uniqueAssets = portfolio
            .filter(item => item?.asset && item.asset.type !== 'savings')
            .map(item => item.asset)
            .filter((asset, index, self) =>
                index === self.findIndex(a => a?.symbol === asset.symbol && a?.type === asset.type)
            );

        uniqueAssets.forEach(asset => loadAssetData(asset));
    }, []); // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps

    const handleAddAsset = useCallback((asset) => {
        if (!asset) return;
        setSelectedAsset(asset);
        setShowAddModal(true);
        loadAssetData(asset); // Load data in background
    }, [loadAssetData]);

    const handleConfirmAdd = useCallback((quantity) => {
        if (!selectedAsset || !quantity) return;
        setPortfolio(prev => [...prev, { id: Date.now(), asset: selectedAsset, quantity }]);
        setShowAddModal(false);
        setSelectedAsset(null);
    }, [selectedAsset]);

    const handleSell = useCallback((entryIndex, qty) => {
        if (!selectedAssetGroup || !selectedAssetGroup.items[entryIndex]) return;

        const entry = selectedAssetGroup.items[entryIndex];
        if (qty >= entry.quantity) {
            setPortfolio(prev => prev.filter(item => item.id !== entry.id));
        } else {
            setPortfolio(prev => prev.map(item =>
                item.id === entry.id
                    ? { ...item, quantity: item.quantity - qty }
                    : item
            ));
        }
        setShowSellModal(false);
        setSelectedAssetGroup(null);
    }, [selectedAssetGroup]);

    const renderScreen = () => {
        try {
            switch (currentScreen) {
                case 'portfolio':
                    return (
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
                case 'analytics':
                    return <AnalyticsScreen portfolio={portfolio} assetData={assetData} />;
                case 'settings':
                    return <SettingsScreen portfolio={portfolio} setPortfolio={setPortfolio} />;
                default:
                    return null;
            }
        } catch (error) {
            console.error('Screen render error:', error);
            return (
                <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '2rem', border: '2px solid #ef4444' }}>
                    <h2 style={{ color: '#ef4444', fontWeight: 'bold' }}>Error</h2>
                    <p style={{ color: '#94a3b8' }}>An error occurred. Please refresh the page.</p>
                </div>
            );
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
            {showAddModal && selectedAsset && (
                <AddAssetModal
                    asset={selectedAsset}
                    onClose={() => {
                        setShowAddModal(false);
                        setSelectedAsset(null);
                    }}
                    onConfirm={handleConfirmAdd}
                    loading={loadingModal}
                />
            )}
            {showSellModal && selectedAssetGroup && (
                <SellModal
                    assetGroup={selectedAssetGroup}
                    onClose={() => setShowSellModal(false)}
                    onSell={handleSell}
                    loading={loadingModal}
                />
            )}
            {selectedAssetGroup && (
                <AssetDetailModal
                    group={selectedAssetGroup}
                    onClose={() => setSelectedAssetGroup(null)}
                    onBuy={handleAddAsset}
                    onSell={() => setShowSellModal(true)}
                />
            )}
        </div>
    );
};

export default App;
