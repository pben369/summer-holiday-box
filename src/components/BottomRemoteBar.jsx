import React from 'react';
import { Power, Play, Pause, FastForward, Rewind, Volume2 } from 'lucide-react';

const BottomRemoteBar = ({ onExit, isPlayerOpen, contentType, setContentType, onSurprise }) => {
    return (
        <div style={styles.remoteBar} className="glass-panel">
            {/* Power Button - Exits video playback */}
            <button
                className="glow-card focusable"
                style={{
                    ...styles.remoteButton,
                    ...styles.powerButton,
                    opacity: isPlayerOpen ? 1 : 0.5,
                    border: isPlayerOpen ? '2px solid var(--neon-magenta)' : '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onClick={onExit}
                title="Exit Playing Video"
            >
                <Power size={20} color={isPlayerOpen ? "var(--neon-magenta)" : "white"} />
            </button>

            {/* Media Controls */}
            <div style={styles.controlGroup}>
                <button className="glow-card focusable" style={styles.remoteButton} title="Rewind"><Rewind size={20} /></button>
                <button className="glow-card focusable" style={styles.remoteButton} title="Play"><Play size={20} /></button>
                <button className="glow-card focusable" style={styles.remoteButton} title="Pause"><Pause size={20} /></button>
                <button className="glow-card focusable" style={styles.remoteButton} title="Fast Forward"><FastForward size={20} /></button>
            </div>

            {/* Volume Control */}
            <div style={styles.controlGroup}>
                <Volume2 size={20} style={{ color: 'var(--text-secondary)' }} />
                <div style={styles.volumeBar}>
                    <div style={{ ...styles.volumeFill, width: '60%' }}></div>
                </div>
            </div>

            {/* Color Keys */}
            <div style={styles.colorGroup}>
                <button
                    className="glow-card focusable"
                    style={{
                        ...styles.colorButton,
                        background: '#FF3B30',
                        border: contentType === 'live' ? '2px solid white' : 'none',
                        boxShadow: contentType === 'live' ? '0 0 15px #FF3B30' : 'none'
                    }}
                    onClick={() => setContentType('live')}
                    title="Live Channels (Red)"
                ></button>
                <button
                    className="glow-card focusable"
                    style={{
                        ...styles.colorButton,
                        background: '#34C759',
                        border: contentType === 'series' ? '2px solid white' : 'none',
                        boxShadow: contentType === 'series' ? '0 0 15px #34C759' : 'none'
                    }}
                    onClick={() => setContentType('series')}
                    title="YouTube Series (Green)"
                ></button>
                <button
                    className="glow-card focusable"
                    style={{
                        ...styles.colorButton,
                        background: '#FFCC00',
                        border: contentType === 'all' ? '2px solid white' : 'none',
                        boxShadow: contentType === 'all' ? '0 0 15px #FFCC00' : 'none'
                    }}
                    onClick={() => setContentType('all')}
                    title="All Content (Yellow)"
                ></button>
                <button
                    className="glow-card focusable"
                    style={{
                        ...styles.colorButton,
                        background: '#007AFF'
                    }}
                    onClick={onSurprise}
                    title="Surprise Me! (Blue)"
                ></button>
            </div>
        </div>
    );
};

const styles = {
    remoteBar: {
        height: '70px',
        minHeight: '70px', /* Ensure it doesn't shrink */
        borderRadius: '20px',
        marginTop: 'auto',
        display: 'flex',
        alignItems: 'center',
        padding: '0 30px',
        justifyContent: 'space-between',
        backgroundColor: 'var(--remote-bg)',
        zIndex: 10,
    },
    remoteButton: {
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        width: '45px',
        height: '45px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'var(--text-secondary)',
    },
    powerButton: {
        background: 'rgba(255, 59, 48, 0.2)',
        borderColor: 'var(--neon-magenta)',
    },
    controlGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    volumeBar: {
        width: '100px',
        height: '6px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '3px',
        overflow: 'hidden',
    },
    volumeFill: {
        height: '100%',
        background: 'var(--neon-blue)',
        borderRadius: '3px',
    },
    colorGroup: {
        display: 'flex',
        gap: '8px',
    },
    colorButton: {
        width: '45px',
        height: '15px',
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
    }
};

export default BottomRemoteBar;
