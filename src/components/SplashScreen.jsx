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
            <div className="splash-logo-container">
                <h1 className="splash-title">SUMMER BOX</h1>
                <p className="splash-subtitle">Magic Holiday Fun</p>
                <div className="splash-loader"></div>
            </div>
        </div>
    );
};

export default SplashScreen;
