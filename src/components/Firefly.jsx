import React, { useState, useEffect } from 'react';

const Firefly = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [target, setTarget] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setTarget({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const moveFirefly = () => {
            setPosition(prev => ({
                x: prev.x + (target.x - prev.x) * 0.1,
                y: prev.y + (target.y - prev.y) * 0.1
            }));
        };

        const animationFrame = requestAnimationFrame(moveFirefly);
        return () => cancelAnimationFrame(animationFrame);
    }, [target, position]);

    return (
        <div
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                width: '6px',
                height: '6px',
                backgroundColor: '#ccff00',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 99999,
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 10px #ccff00, 0 0 20px #ccff00',
                animation: 'fireflyPulse 1.5s infinite alternate ease-in-out'
            }}
        />
    );
};

export default Firefly;
