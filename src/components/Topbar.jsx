import React from 'react';
import { Search, Star } from 'lucide-react';

const Topbar = ({ searchQuery, setSearchQuery, showFavoritesOnly, setShowFavoritesOnly }) => {
    return (
        <div style={styles.topbar}>
            <h1 style={styles.title}>KIDS TV</h1>

            <div style={styles.actions}>
                <button
                    style={{
                        ...styles.iconButton,
                        background: showFavoritesOnly ? 'rgba(0, 225, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        borderColor: showFavoritesOnly ? 'var(--neon-blue)' : 'rgba(255, 255, 255, 0.1)'
                    }}
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className="focusable"
                    title={showFavoritesOnly ? "Show All" : "Show Favorites"}
                >
                    <Star
                        size={24}
                        fill={showFavoritesOnly ? "var(--neon-blue)" : "none"}
                        color={showFavoritesOnly ? "var(--neon-blue)" : "white"}
                    />
                </button>

                <div style={styles.searchBar} className="glass-panel">
                    <input
                        type="text"
                        placeholder="Search channels..."
                        style={styles.searchInput}
                        title="Search"
                        className="focusable"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search size={20} color="var(--text-secondary)" />
                </div>
            </div>
        </div>
    );
};

const styles = {
    topbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px 20px 20px',
    },
    title: {
        fontSize: '32px',
        fontWeight: '800',
        color: 'var(--neon-blue)',
        textShadow: '0 0 10px rgba(0, 225, 255, 0.5)',
        letterSpacing: '2px',
        margin: 0,
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    searchBar: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 20px',
        borderRadius: '30px',
        width: '300px',
    },
    searchInput: {
        background: 'transparent',
        border: 'none',
        color: 'var(--text-primary)',
        fontSize: '16px',
        outline: 'none',
        flexGrow: 1,
        fontFamily: 'inherit',
    },
    iconButton: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    }
};

export default Topbar;
