import React, { useState, useEffect } from 'react';
import { Loader, X } from 'lucide-react';
import { SAVINGS_PRESETS } from '../constants';

const AddSavingsModal = ({ onClose, onConfirm, loading, initialSavings }) => {
    const isEdit = !!initialSavings;
    const [amount, setAmount] = useState(initialSavings ? initialSavings.amount.toString() : '');
    const [selectedPreset, setSelectedPreset] = useState('custom');
    const [rate, setRate] = useState(initialSavings ? initialSavings.rate : 4.50);
    const [name, setName] = useState(initialSavings ? initialSavings.name : '');

    useEffect(() => {
        if (initialSavings) {
            const matchingPreset = SAVINGS_PRESETS.find(p => p.name === initialSavings.name && p.rate === initialSavings.rate);
            if (matchingPreset) {
                setSelectedPreset(matchingPreset.id);
            } else {
                setSelectedPreset('custom');
            }
        }
    }, [initialSavings]);

    const handlePresetChange = (e) => {
        const presetId = e.target.value;
        const preset = SAVINGS_PRESETS.find(p => p.id === presetId);
        setSelectedPreset(presetId);

        if (preset) {
            setRate(preset.rate);
            setName(preset.name);
        } else {
            if (!isEdit) setName('');
        }
    };

    const handleConfirm = () => {
        const parsedAmount = parseFloat(amount);
        if (parsedAmount >= 0.01 && name.trim()) {
            const savingsData = {
                name: name.trim(),
                amount: parsedAmount,
                rate: parseFloat(rate),
                type: 'savings',
                id: initialSavings ? initialSavings.id : Date.now(),
            };
            onConfirm(savingsData);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }} onClick={onClose}>
            <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '2rem', maxWidth: '28rem', width: '90%', border: `2px solid ${isEdit ? '#f97316' : '#10b981'}`, boxShadow: `0 0 40px rgba(${isEdit ? '249, 115, 22' : '16, 185, 129'}, 0.2)` }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white' }}>{isEdit ? 'Edit Savings Account' : 'Add Savings Account'}</h2>
                    <button onClick={onClose} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Account Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., My Emergency Fund"
                        style={{ width: '100%', backgroundColor: '#0f172a', border: '2px solid #334155', borderRadius: '0.5rem', padding: '0.75rem', color: 'white', fontSize: '1rem' }}
                        disabled={loading}
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Account Type</label>
                    <select
                        value={selectedPreset}
                        onChange={handlePresetChange}
                        style={{ width: '100%', backgroundColor: '#0f172a', border: '2px solid #334155', borderRadius: '0.5rem', padding: '0.75rem', color: 'white', fontSize: '1rem' }}
                        disabled={loading}
                    >
                        <option value="custom">Custom Rate</option>
                        {SAVINGS_PRESETS.map(preset => (
                            <option key={preset.id} value={preset.id}>
                                {preset.name} ({preset.rate}% APY)
                            </option>
                        ))}
                    </select>
                </div>
                {(selectedPreset === 'custom' || isEdit) && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{isEdit ? 'Current Rate' : 'Custom Rate'} (% APY)</label>
                        <input
                            type="number"
                            value={rate}
                            onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                            step="0.01"
                            min="0"
                            max="10"
                            style={{ width: '100%', backgroundColor: '#0f172a', border: '2px solid #334155', borderRadius: '0.5rem', padding: '0.75rem', color: 'white', fontSize: '1rem' }}
                            disabled={loading}
                        />
                    </div>
                )}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{isEdit ? 'Current Balance' : 'Initial Deposit Amount'} ($)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        style={{ width: '100%', backgroundColor: '#0f172a', border: '2px solid #334155', borderRadius: '0.5rem', padding: '0.75rem', color: 'white', fontSize: '1rem' }}
                        disabled={loading}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button
                        onClick={onClose}
                        style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', backgroundColor: '#334155', color: 'white', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || parseFloat(amount) < 0.01 || !name.trim()}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            backgroundColor: isEdit ? '#f97316' : '#10b981',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: (loading || parseFloat(amount) < 0.01 || !name.trim()) ? 0.5 : 1
                        }}
                    >
                        {loading ? <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> : (isEdit ? 'Save Changes' : 'Add Account')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSavingsModal;
