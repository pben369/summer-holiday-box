import React from 'react';
import { Play, Pause, FastForward, Rewind, Volume2 } from 'lucide-react';

const BottomRemoteBar = () => {
    return (
        <div style={styles.remoteBar} className="glass-panel">
            {/* Media Controls */}
            <div style={styles.controlGroup}>
                <button className="focusable" style={styles.remoteButton}><Rewind size={20} /></button>
                <button className="focusable" style={styles.remoteButton}><Play size={20} /></button>
                <button className="focusable" style={styles.remoteButton}><Pause size={20} /></button>
                <button className="focusable" style={styles.remoteButton}><FastForward size={20} /></button>
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
                <button className="focusable" style={{ ...styles.colorButton, background: '#FF3B30' }}></button>
                <button className="focusable" style={{ ...styles.colorButton, background: '#34C759' }}></button>
                <button className="focusable" style={{ ...styles.colorButton, background: '#FFCC00' }}></button>
                <button className="focusable" style={{ ...styles.colorButton, background: '#007AFF' }}></button>
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
