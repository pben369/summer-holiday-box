import React, { useState, useEffect } from 'react';

const SplashScreen = ({ onComplete }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Show splash for 2.5 seconds, then trigger fade out
        const timer = setTimeout(() => {
            setFadeOut(true);
            // Wait for fade out animation to finish before calling onComplete
            setTimeout(onComplete, 800);
        }, 2500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className={`splash-container ${fadeOut ? 'fade-out' : ''}`} style={{ opacity: fadeOut ? 0 : 1 }}>
            <div className="splash-background" style={{
                backgroundImage: 'url(./summer-splash.jpg)',
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.4, // Subdued background to keep text readable
                zIndex: -1
            }}></div>
            <div className="splash-logo-container">
                <h1 className="splash-title">SUMMER BOX</h1>
                <p className="splash-subtitle">Magic Holiday Fun</p>
                <div className="splash-loader"></div>
            </div>
        </div>
    );
};

export default SplashScreen;
