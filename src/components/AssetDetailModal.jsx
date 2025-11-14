import React from 'react';
import { X } from 'lucide-react';

const AssetDetailModal = ({ group, onClose, onBuy, onSell }) => {

    if (!group) return null;
    const { symbol, items, data } = group;
    const asset = items[0]?.asset;
    if (!asset) return null;

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const currentPrice = data?.quote?.price || 0;
    const totalValue = currentPrice * totalQuantity;
    const changePercent = data?.quote?.changePercent || 0;
    const isPositive = changePercent >= 0;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 50,
                backdropFilter: 'blur(4px)'
            }}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`asset-modal-title-${symbol}`}
        >
            <div
                style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '1rem',
                    padding: '2rem',
                    maxWidth: '32rem',
                    width: '90%',
                    border: '2px solid #3b82f6',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h2
                            id={`asset-modal-title-${symbol}`}
                            style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.25rem' }}
                        >
                            {symbol}
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{asset.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Current Price and Change */}
                <div style={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', border: '2px solid #3b82f6' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Current Price</p>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6' }}>${currentPrice.toFixed(2)}</p>
                    <p style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: isPositive ? '#10b981' : '#ef4444',
                        marginTop: '0.25rem'
                    }}>
                        {isPositive ? '+' : ''}{changePercent.toFixed(2)}% (24h)
                    </p>
                </div>

                {/* Total Holdings */}
                <div style={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', border: '1px solid #334155' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Holdings</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{totalQuantity.toFixed(4)} units</p>
                    <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#3b82f6', marginTop: '0.25rem' }}>${totalValue.toFixed(2)}</p>
                </div>

                {/* Actions: Buy/Sell */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <button
                        onClick={() => {
                            onBuy(asset);
                            onClose();
                        }}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                    >
                        Buy More
                    </button>
                    {totalQuantity > 0 && (
                        <button
                            onClick={onSell}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                        >
                            Sell
                        </button>
                    )}
                </div>

                {/* Purchase History */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>Purchase History</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {items.length === 0 ? (
                            <p style={{ color: '#64748b', textAlign: 'center' }}>No purchases yet</p>
                        ) : (
                            items.map((item, idx) => (
                                <div
                                    key={item.id}
                                    style={{
                                        backgroundColor: '#0f172a',
                                        borderRadius: '0.5rem',
                                        padding: '0.75rem',
                                        border: '1px solid #334155'
                                    }}
                                >
                                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Entry #{idx + 1}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ color: 'white', fontWeight: '600' }}>{item.quantity.toFixed(4)} units</p>
                                        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                                            Added: {new Date(item.id).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#334155',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#475569'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default AssetDetailModal;
