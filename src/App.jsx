import React, { useState, useEffect } from 'react';
import './App.css';
import Topbar from './components/Topbar';
import Player from './components/Player';
import SplashScreen from './components/SplashScreen';
import Firefly from './components/Firefly';
import { parseM3U } from './utils/m3uParser';
import useSpatialNavigation from './hooks/useSpatialNavigation';
import { Play, Star } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

// A simpler component to show parsed channels
const ChannelGrid = ({ channels, onSelectChannel, searchQuery, favorites, toggleFavorite, showFavoritesOnly, contentType, setHoveredLogo }) => {
  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isFav = favorites.includes(channel.id);
    const matchesFavorite = showFavoritesOnly ? isFav : true;

    let matchesType = true;
    if (contentType === 'live') {
      matchesType = channel.category !== 'YouTube Series';
    } else if (contentType === 'series') {
      matchesType = channel.category === 'YouTube Series';
    }

    return matchesSearch && matchesFavorite && matchesType;
  });

  let categoryText = `All Channels (${filteredChannels.length})`;
  let categoryColor = '#FFCC00';

  if (showFavoritesOnly) {
    categoryText = `⭐ My Favorites (${filteredChannels.length})`;
    categoryColor = '#FFD700';
  } else if (searchQuery) {
    categoryText = `Search: "${searchQuery}" (${filteredChannels.length})`;
    categoryColor = 'var(--neon-blue)';
  } else if (contentType === 'live') {
    categoryText = `🔴 Live (${filteredChannels.length})`;
    categoryColor = '#FF3B30';
  } else if (contentType === 'series') {
    categoryText = `🟢 Series (${filteredChannels.length})`;
    categoryColor = '#34C759';
  }

  // Detect touch device to skip hover-bg effect
  const isTouch = window.matchMedia('(hover: none)').matches;

  return (
    <div style={{ padding: '0 20px', paddingBottom: '40px' }}>
      <h2 className="category-title" style={{ color: categoryColor }}>
        {categoryText}
      </h2>
      <div className="channel-grid">
        {filteredChannels.map((channel, idx) => (
          <Tilt
            key={idx}
            tiltMaxAngleX={15}
            tiltMaxAngleY={15}
            scale={1.05}
            transitionSpeed={400}
            glareEnable={!isTouch}
            glareMaxOpacity={0.3}
            glareBorderRadius="16px"
            style={{ position: 'relative' }}
          >
            <button
              className="glow-card focusable channel-card"
              onClick={() => onSelectChannel(channel)}
              onMouseEnter={() => !isTouch && setHoveredLogo(channel.logo)}
              onMouseLeave={() => !isTouch && setHoveredLogo(null)}
              onFocus={() => !isTouch && setHoveredLogo(channel.logo)}
              onBlur={() => !isTouch && setHoveredLogo(null)}
            >
              {channel.logo ? (
                <img src={channel.logo} alt={channel.name} style={styles.channelLogo} loading="lazy" />
              ) : (
                <div style={styles.placeholderLogo}><Play size={40} color="white" /></div>
              )}
              <div className="channel-name-overlay">
                <span className="channel-name">{channel.name}</span>
              </div>
            </button>
            <button
              className="focusable fav-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(channel.id);
              }}
              title={favorites.includes(channel.id) ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Star
                size={20}
                fill={favorites.includes(channel.id) ? "#FFD700" : "none"}
                color={favorites.includes(channel.id) ? "#FFD700" : "white"}
              />
            </button>
          </Tilt>
        ))}
      </div>
      {showFavoritesOnly && filteredChannels.length === 0 && (
        <div style={{ textAlign: 'center', color: 'gray', marginTop: '100px' }}>
          <Star size={64} style={{ marginBottom: '20px', opacity: 0.3 }} />
          <p style={{ fontSize: '20px' }}>No favorites yet! Click the star on any show to add it here.</p>
        </div>
      )}
    </div>
  )
}

const ContinueWatching = ({ history, onSelectChannel }) => {
  if (!history.length) return null;
  return (
    <div style={{ padding: '0 20px 16px' }}>
      <h2 className="category-title" style={{ color: '#00e1ff' }}>▶ Continue Watching</h2>
      <div className="cw-row">
        {history.map((ch) => (
          <button
            key={ch.id}
            className="glow-card focusable cw-card"
            onClick={() => onSelectChannel(ch)}
            title={ch.name}
          >
            {ch.logo
              ? <img src={ch.logo} alt={ch.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} loading="lazy" />
              : <Play size={28} color="white" />}
            <div className="channel-name-overlay">
              <span className="channel-name">{ch.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

function App() {
  // Use custom hook for TV Remote navigation
  useSpatialNavigation();

  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('praveen_tv_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [contentType, setContentType] = useState('all'); // 'all', 'live'
  const [hoveredLogo, setHoveredLogo] = useState(null);
  const [watchHistory, setWatchHistory] = useState(() => {
    const saved = localStorage.getItem('shb_watch_history');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSelectChannel = (ch) => {
    setSelectedChannel(ch);
    setWatchHistory(prev => {
      const deduped = prev.filter(c => c.id !== ch.id);
      const updated = [ch, ...deduped].slice(0, 5);
      localStorage.setItem('shb_watch_history', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    localStorage.setItem('praveen_tv_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    // Fetch and parse the IPTV playlist
    const loadChannels = async () => {
      const data = await parseM3U('https://iptv-org.github.io/iptv/categories/kids.m3u');

      const youtubePlaylists = [
        {
          id: 'yt-tf-prime',
          name: 'Transformers Prime | The Complete Series',
          logo: 'transformers-logo.png',
          category: 'YouTube Series',
          url: 'https://www.youtube.com/embed/videoseries?list=PL7VEq3tXc6hsvHKfzdknf8GViPEr5JW5W&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-mickey',
          name: 'Mickey Mouse Shorts',
          logo: 'mickey-mouse-logo.png',
          category: 'YouTube Series',
          url: 'https://www.youtube.com/embed/videoseries?list=PLizxw74WMldc6_LcrvVBWbFHWEPVrLBJt&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-sonic',
          name: 'Adventures of Sonic the Hedgehog',
          logo: 'Adventures-of-sonic-logo.png',
          category: 'YouTube Series',
          url: 'https://www.youtube.com/embed/videoseries?list=PLySo2SlSHPSOOGZM3_2Qun52hCaRNYW9y&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-pooh',
          name: 'The New Adventures of Winnie the Pooh',
          logo: 'Winnie-the-pooh-logo.png',
          category: 'YouTube Series',
          url: 'https://www.youtube.com/embed/videoseries?list=PLK4Lvw59uq_-1om0c83tCLEd9XaXv0kCJ&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-beyblade',
          name: 'BEYBLADE METAL FUSION',
          logo: 'beyblade-metal-logo.png',
          category: 'YouTube Series',
          url: 'https://www.youtube.com/embed/videoseries?list=PLiih4uqcEp-37ddXx6No4SOBmTt4_HA9-&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-avengers',
          name: 'AVENGERS ASSEMBLE (2013-19)',
          logo: 'Avengers-assemble-logo.png',
          category: 'YouTube Series',
          url: 'https://www.youtube.com/embed/videoseries?list=PLr_UAhQSlwSViOALgwdo7lLcl9n5Kp69Y&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-pokemon',
          name: 'Pokemon The Series',
          logo: 'pokemon-the-series-logo.png',
          category: 'YouTube Series',
          url: 'https://www.youtube.com/embed/videoseries?list=PLbZxdQd9WcS1uKICOgIvHBAjRyJsAtZgr&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-bandbudh',
          name: 'Bandbudh And Budbak',
          logo: 'bandbudh-logo.png',
          category: 'YouTube Series',
          url: 'https://www.youtube.com/embed/videoseries?list=PL-4vjtQdv9wMY8NiZIN28O3xE8XDS3iyh&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-junglebook',
          name: 'The Jungle Book Hindi',
          logo: 'jungle-book-logo.png',
          category: 'YouTube Series',
          url: 'https://www.youtube.com/embed/videoseries?list=PL7kd5bTo_Q1rKEFR6z3O0DPExOF8vKhyU&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-heman',
          name: 'He-Man Master of Universe',
          logo: 'hee-man-logo.png',
          category: 'YouTube Series',
          url: 'https://www.youtube.com/embed/videoseries?list=PLkiXH7NXzBmF_XbuEz7TmYLMYhKuJ3TVe&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-malgudi',
          name: 'Malgudi Days',
          logo: 'malgudi-days-logo.png',
          category: 'YouTube Series',
          url: 'https://www.youtube.com/embed/videoseries?list=PL_c7L8RcICKpLCrTT_ZlyBlooup2aHBjT&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-gravityfalls',
          name: 'Gravity Falls',
          logo: 'gravity-falls-logo.png',
          category: 'YouTube Live',
          url: 'https://www.youtube.com/embed/eE1L08hNdW8?autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-gooftroop',
          name: 'Goof Troop',
          logo: 'goof-troop-logo.png',
          category: 'YouTube Live',
          url: 'https://www.youtube.com/embed/1mLPTfLwm-M?autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-tomjerry',
          name: 'Tom and Jerry',
          logo: 'tom-and-jerry-logo.png',
          category: 'YouTube Live',
          url: 'https://www.youtube.com/embed/400k2SKoeh4?autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-avengers-assemble',
          name: "Marvel's Avengers Assemble",
          logo: 'avengers-assemble-vid-logo.png',
          category: 'YouTube Live',
          url: 'https://www.youtube.com/embed/13GZtHqYrLY?autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-winnie-pooh-adv',
          name: 'The New Adventures of Winnie the Pooh',
          logo: 'winnie-pooh-adv-logo.png',
          category: 'YouTube Live',
          url: 'https://www.youtube.com/embed/URXBh2PRp0o?autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-regularshow',
          name: 'Regular Show',
          logo: 'regular-show-logo.png',
          category: 'YouTube Live',
          url: 'https://www.youtube.com/embed/aPGvK6tJMXk?autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-bigcitygreens',
          name: 'Big City Greens',
          logo: 'big-city-greens-logo.png',
          category: 'YouTube Live',
          url: 'https://www.youtube.com/embed/B_5RPAixkG4?autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-avatar',
          name: 'Avatar Air bender',
          logo: 'avatar-logo.png',
          category: 'YouTube Live',
          url: 'https://www.youtube.com/embed/RQKennJryJo?autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-ducktales',
          name: 'Duck tales 1987',
          logo: 'duck-tales-logo.png',
          category: 'YouTube Live',
          url: 'https://www.youtube.com/embed/XD50huu0M24?autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-tangled',
          name: 'Tangled Adventure',
          logo: 'tangled-logo.png',
          category: 'YouTube Live',
          url: 'https://www.youtube.com/embed/kuIgnSxGirw?autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        }
      ];

      setChannels([...youtubePlaylists, ...data]);
      setLoading(false);
    };
    loadChannels();
  }, []);

  return (
    <>
      <Firefly />
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className="app-container">
        <div className="main-content">
          <div
            className="dynamic-bg"
            style={{
              backgroundImage: hoveredLogo ? `url(${hoveredLogo})` : 'none',
              opacity: hoveredLogo ? 0.4 : 0
            }}
          />
          <Topbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showFavoritesOnly={showFavoritesOnly}
            setShowFavoritesOnly={setShowFavoritesOnly}
            contentType={contentType}
            setContentType={setContentType}

          />

          <div className="content-area">
            {loading ? (
              <div className="loading-overlay" style={{ background: 'transparent' }}>
                <div className="spinner"></div>
                <div className="loading-text">Loading Channels...</div>
              </div>
            ) : selectedChannel ? (
              <Player streamUrl={selectedChannel.url} onBack={() => setSelectedChannel(null)} />
            ) : (
              <>
                <ContinueWatching history={watchHistory} onSelectChannel={handleSelectChannel} />
                <ChannelGrid
                  channels={channels}
                  searchQuery={searchQuery}
                  favorites={favorites}
                  showFavoritesOnly={showFavoritesOnly}
                  contentType={contentType}
                  onSelectChannel={handleSelectChannel}
                  setHoveredLogo={setHoveredLogo}
                  toggleFavorite={(id) => {
                    setFavorites(prev =>
                      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
                    );
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  channelLogo: {
    maxWidth: '80%',
    maxHeight: '80%',
    objectFit: 'contain',
    zIndex: 1,
  },
  placeholderLogo: {
    opacity: 0.5,
  },
  channelNameOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
    padding: '10px',
    textAlign: 'center',
    zIndex: 2,
  },
  channelName: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'white',
    textShadow: '0 1px 3px black',
  },
  favoriteButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 10,
    background: 'rgba(0,0,0,0.5)',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(5px)',
    transition: 'all 0.2s ease'
  }
};

export default App;
