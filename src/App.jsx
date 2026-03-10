import React, { useState, useEffect } from 'react';
import './App.css';
import Topbar from './components/Topbar';
import BottomRemoteBar from './components/BottomRemoteBar';
import Player from './components/Player';
import { parseM3U } from './utils/m3uParser';
import useSpatialNavigation from './hooks/useSpatialNavigation';
import { Play } from 'lucide-react';

// A simpler component to show parsed channels
const ChannelGrid = ({ channels, onSelectChannel }) => {
  return (
    <div style={{ padding: '0 20px', paddingBottom: '40px' }}>
      <h2 style={styles.categoryTitle}>All Channels</h2>
      <div style={styles.grid}>
        {channels.map((channel, idx) => (
          <button
            key={idx}
            className="glow-card focusable"
            style={styles.channelCard}
            onClick={() => onSelectChannel(channel)}
          >
            {channel.logo ? (
              <img src={channel.logo} alt={channel.name} style={styles.channelLogo} />
            ) : (
              <div style={styles.placeholderLogo}><Play size={40} color="white" /></div>
            )}
            <div style={styles.channelNameOverlay}>
              <span style={styles.channelName}>{channel.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function App() {
  // Use custom hook for TV Remote navigation
  useSpatialNavigation();

  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    // Fetch and parse the IPTV playlist
    const loadChannels = async () => {
      const data = await parseM3U('https://iptv-org.github.io/iptv/categories/kids.m3u');

      const youtubePlaylists = [
        {
          id: 'yt-tf-prime',
          name: 'Transformers Prime | The Complete Series',
          logo: '/transformers-logo.png',
          category: 'YouTube',
          url: 'https://www.youtube.com/embed/videoseries?list=PL7VEq3tXc6hsvHKfzdknf8GViPEr5JW5W&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-mickey',
          name: 'Mickey Mouse Shorts',
          logo: '/mickey-mouse-logo.png',
          category: 'YouTube',
          url: 'https://www.youtube.com/embed/videoseries?list=PLizxw74WMldc6_LcrvVBWbFHWEPVrLBJt&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-sonic',
          name: 'Adventures of Sonic the Hedgehog',
          logo: '/Adventures-of-sonic-logo.png',
          category: 'YouTube',
          url: 'https://www.youtube.com/embed/videoseries?list=PLySo2SlSHPSOOGZM3_2Qun52hCaRNYW9y&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-pooh',
          name: 'The New Adventures of Winnie the Pooh',
          logo: '/Winnie-the-pooh-logo.png',
          category: 'YouTube',
          url: 'https://www.youtube.com/embed/videoseries?list=PLK4Lvw59uq_-1om0c83tCLEd9XaXv0kCJ&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-beyblade',
          name: 'BEYBLADE METAL FUSION',
          logo: '/beyblade-metal-logo.png',
          category: 'YouTube',
          url: 'https://www.youtube.com/embed/videoseries?list=PLiih4uqcEp-37ddXx6No4SOBmTt4_HA9-&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-avengers',
          name: 'AVENGERS ASSEMBLE (2013-19)',
          logo: '/Avengers-assemble-logo.png',
          category: 'YouTube',
          url: 'https://www.youtube.com/embed/videoseries?list=PLr_UAhQSlwSViOALgwdo7lLcl9n5Kp69Y&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-pokemon',
          name: 'Pokemon The Series',
          logo: '/pokemon-the-series-logo.png',
          category: 'YouTube',
          url: 'https://www.youtube.com/embed/videoseries?list=PLbZxdQd9WcS1uKICOgIvHBAjRyJsAtZgr&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        },
        {
          id: 'yt-bandbudh',
          name: 'Bandbudh And Budbak',
          logo: '/bandbudh-logo.png',
          category: 'YouTube',
          url: 'https://www.youtube.com/embed/videoseries?list=PL-4vjtQdv9wMY8NiZIN28O3xE8XDS3iyh&autoplay=1&controls=1&modestbranding=1&rel=0&fs=0',
        }
      ];

      setChannels([...youtubePlaylists, ...data]);
      setLoading(false);
    };
    loadChannels();
  }, []);

  return (
    <div className="app-container">
      <div className="main-content">
        <Topbar />

        <div className="content-area">
          {loading ? (
            <div className="loading-overlay" style={{ background: 'transparent' }}>
              <div className="spinner"></div>
              <div className="loading-text">Loading Channels...</div>
            </div>
          ) : selectedChannel ? (
            <Player streamUrl={selectedChannel.url} onBack={() => setSelectedChannel(null)} />
          ) : (
            <ChannelGrid
              channels={channels}
              onSelectChannel={(ch) => setSelectedChannel(ch)}
            />
          )}
        </div>

        <BottomRemoteBar />
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  channelCard: {
    padding: 0,
    height: '140px',
    background: '#1A1C29',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  categoryTitle: {
    fontSize: '28px',
    color: 'var(--neon-blue)',
    marginBottom: '20px',
  }
};

export default App;
