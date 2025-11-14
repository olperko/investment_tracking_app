import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';

const AddAssetModal = ({ asset, onClose, onConfirm, loading: propLoading }) => {
    const [quantity, setQuantity] = useState(1);
    const [localLoading, setLocalLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (propLoading) {
            setLocalLoading(true);
            setError('');
        } else {
            setLocalLoading(false);
        }
    }, [propLoading]);

    const handleConfirm = () => {
        if (quantity >= 0.001) onConfirm(quantity);
        onClose();
    };

    const handleQuantityChange = (e) => {
        const val = e.target.value;
        setQuantity(val === '' ? '' : Math.max(0.001, parseFloat(val) || 0));
    };

    if (localLoading) {
        return (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }} onClick={onClose}>
                <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '2rem', maxWidth: '28rem', width: '90%', border: '2px solid #3b82f6', boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)' }} onClick={(e) => e.stopPropagation()}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem', textAlign: 'center' }}>{asset.symbol}</h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center' }}>Loading data...</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Loader size={48} className="animate-spin" style={{ color: '#3b82f6' }} />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ /* same modal styles */ }}>
                <h2>{asset.symbol}</h2>
                <p style={{ color: '#ef4444' }}>{error}</p>
            </div>
        );
    }

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }} onClick={onClose}>
            <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '2rem', maxWidth: '28rem', width: '90%', border: '2px solid #3b82f6', boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)' }} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>{asset.symbol}</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{asset.name}</p>
                <div style={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', border: '1px solid #334155' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Asset Type</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#3b82f6', textTransform: 'capitalize' }}>{asset.type}</p>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        step="0.001"
                        min="0.001"
                        aria-label="Quantity to add"
                        style={{ width: '100%', backgroundColor: '#0f172a', border: '2px solid #334155', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: 'white', fontSize: '1rem' }}
                        disabled={localLoading || propLoading}
                    />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={onClose}
                        disabled={localLoading || propLoading}
                        style={{ flex: 1, padding: '0.75rem', backgroundColor: '#334155', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}
                        onMouseEnter={(e) => ! (localLoading || propLoading) && (e.currentTarget.style.backgroundColor = '#475569')}
                        onMouseLeave={(e) => ! (localLoading || propLoading) && (e.currentTarget.style.backgroundColor = '#334155')}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={localLoading || propLoading || quantity < 0.001}
                        style={{ flex: 1, padding: '0.75rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}
                        onMouseEnter={(e) => ! (localLoading || propLoading) && (e.currentTarget.style.backgroundColor = '#2563eb')}
                        onMouseLeave={(e) => ! (localLoading || propLoading) && (e.currentTarget.style.backgroundColor = '#3b82f6')}
                    >
                        {propLoading && <Loader size={16} className="animate-spin mr-2 inline" />}
                        Add to Portfolio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddAssetModal;
