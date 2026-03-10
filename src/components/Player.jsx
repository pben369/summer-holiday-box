import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { X } from 'lucide-react';

const Player = ({ streamUrl, onBack }) => {
    const videoRef = useRef(null);
    const [isBuffering, setIsBuffering] = useState(true);

    useEffect(() => {
        let hls;
        const video = videoRef.current;

        const handleWaiting = () => setIsBuffering(true);
        const handlePlaying = () => setIsBuffering(false);

        if (video) {
            video.addEventListener('waiting', handleWaiting);
            video.addEventListener('playing', handlePlaying);
            video.addEventListener('canplay', handlePlaying);
        }

        if (streamUrl && video) {
            if (Hls.isSupported()) {
                hls = new Hls({
                    maxBufferLength: 30, // seconds
                    maxMaxBufferLength: 600,
                });

                hls.loadSource(streamUrl);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(e => console.log('Playback failed:', e));
                });

                // Add robust error handling to attempt recovery from blank screens/stalls
                hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.warn('Network error, trying to recover...', data);
                                hls.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.warn('Media error (often causes black screens), trying to recover...', data);
                                hls.recoverMediaError();
                                break;
                            default:
                                console.error('Fatal unrecoverable HLS error:', data);
                                hls.destroy();
                                break;
                        }
                    }
                });
            }
            else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // Fallback for Safari natively supporting HLS
                video.src = streamUrl;
                video.addEventListener('loadedmetadata', () => {
                    video.play().catch(e => console.log('Playback failed:', e));
                });
            }
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
            if (video) {
                video.removeEventListener('waiting', handleWaiting);
                video.removeEventListener('playing', handlePlaying);
                video.removeEventListener('canplay', handlePlaying);
            }
        };
    }, [streamUrl]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' || e.key === 'Backspace') {
                e.preventDefault();
                onBack();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onBack]);

    const isYouTube = streamUrl?.includes('youtube.com/embed');

    return (
        <div style={styles.playerWrapper}>
            <button
                style={{ ...styles.backButton, width: 'auto', padding: '5px 10px' }}
                onClick={onBack}
                className="focusable"
                autoFocus // Give focus to back button when player opens
            >
                <X size={14} color="white" style={{ marginRight: '6px' }} />
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '10px' }}>Exit</span>
            </button>

            {isYouTube ? (
                <iframe
                    width="100%"
                    height="100%"
                    src={streamUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={styles.video}
                ></iframe>
            ) : streamUrl ? (
                <video
                    ref={videoRef}
                    style={styles.video}
                    controls
                    autoPlay
                />
            ) : null}

            {!isYouTube && (isBuffering || !streamUrl) && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <div className="loading-text">Tuning in...</div>
                </div>
            )}
        </div>
    );
};

const styles = {
    playerWrapper: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        right: '10px',
        bottom: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '2px solid rgba(0, 225, 255, 0.3)',
        boxShadow: '0 0 30px rgba(0, 225, 255, 0.2), inset 0 0 20px rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)'
    },
    video: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        borderRadius: '22px', // slightly smaller than wrapper
    },
    backButton: {
        position: 'absolute',
        top: '50%',
        left: '20px',
        transform: 'translateY(-50%)',
        zIndex: 101,
        background: 'rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(5px)'
    },
    loading: {
        color: 'white'
    }
};

export default Player;
