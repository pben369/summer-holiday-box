import React from 'react';
import { Search, Star } from 'lucide-react';

const Topbar = ({ searchQuery, setSearchQuery, showFavoritesOnly, setShowFavoritesOnly, contentType, setContentType }) => {
    return (
        <div style={styles.topbar}>
            <div style={styles.colorGroup}>
                <button
                    className="glow-card focusable glow-red"
                    style={{
                        ...styles.colorButton,
                        background: '#FF3B30',
                        border: contentType === 'live' ? '2px solid white' : 'none',
                        boxShadow: contentType === 'live' ? '0 0 15px #FF3B30' : 'none'
                    }}
                    onClick={() => setContentType('live')}
                    title="Live (Red)"
                >
                    Live
                </button>
                <button
                    className="glow-card focusable glow-green"
                    style={{
                        ...styles.colorButton,
                        background: '#34C759',
                        border: contentType === 'series' ? '2px solid white' : 'none',
                        boxShadow: contentType === 'series' ? '0 0 15px #34C759' : 'none'
                    }}
                    onClick={() => setContentType('series')}
                    title="Series (Green)"
                >
                    Series
                </button>
                <button
                    className="glow-card focusable glow-yellow"
                    style={{
                        ...styles.colorButton,
                        background: '#FFCC00',
                        color: 'black',
                        border: contentType === 'all' ? '2px solid white' : 'none',
                        boxShadow: contentType === 'all' ? '0 0 15px #FFCC00' : 'none'
                    }}
                    onClick={() => setContentType('all')}
                    title="Show All (Yellow)"
                >
                    Show All
                </button>
            </div>

            <h1 style={styles.title} className="rainbow-glow">Summer Holiday Box</h1>

            <div style={styles.actions}>
                <button
                    style={{
                        ...styles.iconButton,
                        background: showFavoritesOnly ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        borderColor: showFavoritesOnly ? '#FFD700' : 'rgba(255, 255, 255, 0.1)'
                    }}
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className="focusable"
                    title={showFavoritesOnly ? "Show All" : "Show Favorites"}
                >
                    <Star
                        size={24}
                        fill={showFavoritesOnly ? "#FFD700" : "none"}
                        color={showFavoritesOnly ? "#FFD700" : "white"}
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
        padding: '0 20px 10px 20px',
        position: 'relative',
    },
    colorGroup: {
        display: 'flex',
        gap: '10px',
        zIndex: 2,
    },
    colorButton: {
        padding: '6px 12px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '13px',
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
        cursor: 'pointer',
        fontFamily: '"Bubblegum Sans", system-ui, sans-serif',
    },
    title: {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1,
        fontSize: '36px',
        fontWeight: '900',
        color: 'white',
        letterSpacing: '1.5px',
        margin: 0,
        fontFamily: '"Bubblegum Sans", system-ui, sans-serif',
        textTransform: 'uppercase',
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
