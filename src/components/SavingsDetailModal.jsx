import React from 'react';
import { X, Edit3, Trash2 } from 'lucide-react';

const SavingsDetailModal = ({ savings, onClose, onEdit, onDelete }) => {
    if (!savings) return null;

    const { name, amount, rate } = savings;
    const dailyInterest = (amount * (rate / 100) / 365).toFixed(2);

    const handleEdit = () => {
        onEdit(savings);
    };

    const handleDelete = () => {
        if (window.confirm(`Delete "${name}"? This removes $${amount.toFixed(2)} from your portfolio.`)) {
            onDelete(savings.id);
        }
    };

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
            aria-labelledby="savings-modal-title"
        >
            <div
                style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '1rem',
                    padding: '2rem',
                    maxWidth: '32rem',
                    width: '90%',
                    border: '2px solid #10b981',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 id="savings-modal-title" style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.25rem' }}>
                            {name}
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Savings Account</p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div style={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', border: '2px solid #10b981' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Current Balance</p>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>${amount.toFixed(2)}</p>
                    <p style={{ fontSize: '1rem', fontWeight: '600', color: '#10b981', marginTop: '0.25rem' }}>
                        {rate}% APY • Est. Daily Interest: ${dailyInterest}
                    </p>
                </div>
                <div style={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', border: '1px solid #334155' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Details</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{name}</p>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Rate: {rate}% APY</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <button
                        onClick={handleEdit}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Edit3 size={16} />
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>
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
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default SavingsDetailModal;
