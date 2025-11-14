import React, { useState } from 'react';
import { Loader, X } from 'lucide-react';

const SellModal = ({ assetGroup, onClose, onSell, loading }) => {
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [quantity, setQuantity] = useState('');

    const handleSell = () => {

        const qty = parseFloat(quantity);

        if (selectedEntry !== null && qty > 0 && qty <= assetGroup.items[selectedEntry].quantity) {
            onSell(selectedEntry, qty);
        }
    };

    const entry = selectedEntry !== null ? assetGroup.items[selectedEntry] : null;
    const maxQty = entry ? entry.quantity : 0;

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 51, backdropFilter: 'blur(4px)' }} onClick={onClose}>
            <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '2rem', maxWidth: '28rem', width: '90%', border: '2px solid #ef4444' }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white' }}>Sell {assetGroup.symbol}</h2>
                    <button onClick={onClose} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Select Entry (FIFO)</label>
                    <select
                        value={selectedEntry || ''}
                        onChange={(e) => setSelectedEntry(e.target.value ? parseInt(e.target.value) : null)}
                        style={{ width: '100%', backgroundColor: '#0f172a', border: '2px solid #334155', borderRadius: '0.5rem', padding: '0.75rem', color: 'white' }}
                    >
                        <option value="">Choose entry...</option>
                        {assetGroup.items.map((item, idx) => (
                            <option key={item.id} value={idx}>
                                #{idx + 1} - {item.quantity.toFixed(4)} units ({new Date(item.id).toLocaleDateString()})
                            </option>
                        ))}
                    </select>
                </div>

                {entry && (
                    <div style={{ marginBottom: '1.5rem', backgroundColor: '#0f172a', borderRadius: '0.5rem', padding: '1rem', border: '1px solid #334155' }}>
                        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Available</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{entry.quantity.toFixed(4)} units</p>
                    </div>
                )}

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Quantity to Sell</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        step="0.001"
                        min="0.001"
                        max={maxQty.toFixed(3)}
                        placeholder="0.000"
                        style={{ width: '100%', backgroundColor: '#0f172a', border: '2px solid #334155', borderRadius: '0.5rem', padding: '0.75rem', color: 'white' }}
                        disabled={!entry || loading}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        style={{ flex: 1, padding: '0.75rem', backgroundColor: '#334155', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSell}
                        disabled={!entry || parseFloat(quantity) <= 0 || loading}
                        style={{ flex: 1, padding: '0.75rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600' }}
                    >
                        {loading && <Loader size={16} className="animate-spin mr-2 inline" />}
                        Sell
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SellModal;
