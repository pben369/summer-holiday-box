import React from 'react';
import { Home, Lock, Gamepad2, Star, Heart, User, Settings } from 'lucide-react';

const Sidebar = () => {
    const icons = [
        { icon: <Home size={28} />, id: 'nav-home', active: true },
        { icon: <Lock size={28} />, id: 'nav-lock' },
        { icon: <Gamepad2 size={28} />, id: 'nav-games' },
        { icon: <Star size={28} />, id: 'nav-star' },
        { icon: <Heart size={28} />, id: 'nav-heart' },
        { icon: <User size={28} />, id: 'nav-user' },
        { icon: <Settings size={28} />, id: 'nav-settings' }
    ];

    return (
        <div style={styles.sidebar}>
            {icons.map((item, index) => (
                <button
                    key={item.id}
                    id={item.id}
                    className={`focusable ${item.active ? 'active-icon' : ''}`}
                    style={{
                        ...styles.iconButton,
                        backgroundColor: item.active ? 'rgba(0, 225, 255, 0.2)' : 'transparent',
                        color: item.active ? 'var(--neon-blue)' : 'var(--text-secondary)'
                    }}
                    tabIndex={1}
                >
                    {item.icon}
                </button>
            ))}
        </div>
    );
};

const styles = {
    sidebar: {
        width: '90px',
        backgroundColor: 'var(--sidebar-bg)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px 0',
        gap: '25px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
    },
    iconButton: {
        border: 'none',
        width: '60px',
        height: '60px',
        borderRadius: '15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'transparent',
        color: 'var(--text-secondary)',
        transition: 'all 0.3s ease',
    }
};

export default Sidebar;
