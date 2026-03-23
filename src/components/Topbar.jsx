import React from 'react';
import { Search, Star } from 'lucide-react';

const Topbar = ({ searchQuery, setSearchQuery, showFavoritesOnly, setShowFavoritesOnly, contentType, setContentType }) => {
    return (
        <div className="topbar">
            <h1 className="topbar-title rainbow-glow">Summer Holiday Box</h1>

            <div className="topbar-color-group">
                <button
                    className="glow-card focusable glow-red topbar-color-btn"
                    style={{
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
                    className="glow-card focusable glow-green topbar-color-btn"
                    style={{
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
                    className="glow-card focusable glow-yellow topbar-color-btn"
                    style={{
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

            <div className="topbar-actions">
                <button
                    className="focusable topbar-icon-btn"
                    style={{
                        background: showFavoritesOnly ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        borderColor: showFavoritesOnly ? '#FFD700' : 'rgba(255, 255, 255, 0.1)'
                    }}
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    title={showFavoritesOnly ? "Show All" : "Show Favorites"}
                >
                    <Star
                        size={24}
                        fill={showFavoritesOnly ? "#FFD700" : "none"}
                        color={showFavoritesOnly ? "#FFD700" : "white"}
                    />
                </button>

                <div className="topbar-search glass-panel">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="topbar-search-input focusable"
                        title="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search size={20} color="var(--text-secondary)" />
                </div>
            </div>
        </div>
    );
};

export default Topbar;
