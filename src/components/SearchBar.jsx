import React, { useState, useCallback } from 'react';
import { Search, Loader, AlertCircle } from 'lucide-react';
import { searchSymbols } from '../utils/api';
import { useDebounce } from '../hooks/useDebounce';

const SearchBar = ({ onAddAsset }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const debouncedQuery = useDebounce(query, 300);

    const handleSearch = useCallback(async (value) => {
        if (value.length < 2) {
            setResults([]);
            setShowResults(false);
            setError('');

            return;
        }
        setLoading(true);
        setError('');

        try {
            const searchResults = await searchSymbols(value);
            setResults(searchResults);
            setShowResults(true);
        } catch (err) {
            console.error('Search Error:', err);
            setError('Search failed. Try popular symbols like AAPL or BTC.');
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        handleSearch(debouncedQuery);
    }, [debouncedQuery, handleSearch]);

    const handleSelectAsset = useCallback((asset) => {
        setQuery('');
        setShowResults(false);
        setResults([]);
        setError('');
        onAddAsset(asset);
    }, [onAddAsset]);

    return (
        <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <div style={{
                display: 'flex', alignItems: 'center', backgroundColor: '#0f172a', borderRadius: '0.75rem',
                border: `2px solid ${error ? '#ef4444' : '#1e293b'}`, overflow: 'hidden', boxShadow: '0 0 30px rgba(59, 130, 246, 0.15)',
                transition: 'all 0.3s'
            }}>
                <Search size={24} style={{ marginLeft: '1rem', color: '#3b82f6' }} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 1 && setShowResults(true)}
                    placeholder="Search stocks, crypto..."
                    aria-label="Search assets"
                    style={{
                        flex: 1, backgroundColor: 'transparent', padding: '1rem', color: 'white', fontSize: '1rem',
                        border: 'none', outline: 'none', fontWeight: '500'
                    }}
                />
                {loading && <Loader size={20} className="animate-spin" style={{ marginRight: '1rem', color: '#3b82f6' }} />}
                {error && <AlertCircle size={20} style={{ marginRight: '1rem', color: '#ef4444' }} />}
            </div>
            {error && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem',
                    backgroundColor: '#1e293b', border: '2px solid #ef4444', borderRadius: '0.75rem',
                    padding: '1rem', color: '#ef4444', fontSize: '0.875rem', zIndex: 10
                }}>
                    {error}
                </div>
            )}
            {showResults && results.length > 0 && !error && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem',
                    backgroundColor: '#1e293b', border: '2px solid #3b82f6', borderRadius: '0.75rem',
                    overflow: 'hidden', zIndex: 10, maxHeight: '24rem', overflowY: 'auto'
                }} role="listbox">
                    {results.map((asset) => (
                        <button
                            key={asset.symbol}
                            onClick={() => handleSelectAsset(asset)}
                            style={{
                                width: '100%', padding: '1rem', textAlign: 'left',
                                backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #0f172a',
                                cursor: 'pointer', transition: 'all 0.2s', color: 'white'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            role="option"
                            aria-selected="false"
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{asset.symbol}</p>
                                    <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{asset.name}</p>
                                </div>
                                <span style={{
                                    fontSize: '0.75rem', backgroundColor: '#3b82f6', color: 'white',
                                    padding: '0.25rem 0.75rem', borderRadius: '9999px'
                                }}>
                                {asset.type.toUpperCase()}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
            {showResults && results.length === 0 && !loading && query.length >= 2 && !error && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem',
                    backgroundColor: '#1e293b', border: '2px solid #3b82f6', borderRadius: '0.75rem',
                    padding: '1rem', color: '#94a3b8', fontSize: '0.875rem', zIndex: 10, textAlign: 'center'
                }}>
                    No results found. Try "AAPL" or "BTC".
                </div>
            )}
        </div>
    );
};

export default SearchBar;
