import React from 'react';
import { Package, Settings, LogOut, ShoppingCart, ChefHat } from 'lucide-react';
import { auth } from '../../lib/firebase';

interface LayoutProps {
    children: React.ReactNode;
    currentView?: string;
    onNavigate?: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView = 'inventory', onNavigate }) => {
    return (
        <div className="layout-container" style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar - Desktop (Dark Theme with White Pill Active) */}
            <aside
                className="glass-panel sidebar desktop-only"
                style={{
                    width: '260px',
                    margin: '24px 0 24px 24px',
                    height: 'calc(100vh - 48px)',
                    position: 'sticky',
                    top: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '32px 24px',
                    borderRadius: '32px',
                    // Background handled by class .glass-panel
                }}
            >
                {/* Logo */}
                <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '12px' }}>
                    <div style={{
                        width: '48px', height: '48px',
                        background: 'linear-gradient(135deg, hsl(var(--color-primary)), #8b5cf6)',
                        borderRadius: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                    }}>
                        <ChefHat size={28} strokeWidth={2} />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
                        Tqadiya
                    </span>
                </div>

                {/* Nav Items - Middle */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                    <NavItem
                        icon={<Package size={22} />}
                        label="Inventory"
                        active={currentView === 'inventory'}
                        onClick={() => onNavigate?.('inventory')}
                    />
                    <NavItem
                        icon={<ShoppingCart size={22} />}
                        label="Shopping List"
                        active={currentView === 'todo'}
                        onClick={() => onNavigate?.('todo')}
                    />
                    <NavItem
                        icon={<Settings size={22} />}
                        label="Settings"
                        active={currentView === 'settings'}
                        onClick={() => onNavigate?.('settings')}
                    />
                </nav>

                {/* Bottom Actions */}
                <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', width: '100%' }}>
                    <NavItem
                        icon={<LogOut size={20} />}
                        label="Sign Out"
                        onClick={() => auth.signOut()}
                        active={false}
                        danger
                    />
                </div>
            </aside>

            {/* Main Content */}
            <main
                key={currentView}
                className="animate-fade-in"
                style={{ flex: 1, padding: '24px', maxWidth: '100%', paddingBottom: '100px', marginLeft: '0' }}
            >
                <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                    {children}
                </div>
            </main>

            {/* Bottom Nav - Mobile */}
            <div className="mobile-nav-container mobile-only" style={{ zIndex: 50 }}>
                {/* ... existing mobile nav ... */}
                <ul className="nav-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', width: '100%' }}>

                    <li className={`nav-item ${(currentView === 'inventory' || currentView === 'add') ? 'active' : ''}`} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <button className={`nav-link ${(currentView === 'inventory' || currentView === 'add') ? 'active' : ''}`} onClick={() => onNavigate?.('inventory')}>
                            <span className="icon">
                                <Package size={24} />
                            </span>
                            <span className="text">Pantry</span>
                        </button>
                    </li>

                    <li className={`nav-item ${currentView === 'todo' ? 'active' : ''}`} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <button className={`nav-link ${currentView === 'todo' ? 'active' : ''}`} onClick={() => onNavigate?.('todo')}>
                            <span className="icon">
                                <ShoppingCart size={24} />
                            </span>
                            <span className="text">Shop</span>
                        </button>
                    </li>

                    <li className={`nav-item ${currentView === 'settings' ? 'active' : ''}`} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <button className={`nav-link ${currentView === 'settings' ? 'active' : ''}`} onClick={() => onNavigate?.('settings')}>
                            <span className="icon">
                                <Settings size={24} />
                            </span>
                            <span className="text">Settings</span>
                        </button>
                    </li>

                    <div
                        className="indicator"
                        style={{
                            left: `calc(100% / 3 * ${(currentView === 'inventory' || currentView === 'add') ? 0 : currentView === 'todo' ? 1 : 2} + 100% / 6 - 28px)`
                        }}
                    />
                </ul>
            </div>

            {/* Mobile/Desktop Visibility Utility Styles */}
            <style>{`
        @media (max-width: 1024px) {
          .desktop-only { display: none !important; }
        }
        @media (min-width: 1025px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
        </div>
    );
};

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
    danger?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick, danger = false }) => (
    <button
        onClick={onClick}
        className="tap-scale"
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 24px',
            width: '100%',
            borderRadius: '20px', // More organic roundness
            border: active ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
            // Active State: Transparent blue tint
            background: active ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
            boxShadow: active ? '0 0 20px -5px rgba(59, 130, 246, 0.3)' : 'none',

            // Text Colors
            color: active ? '#60a5fa' : (danger ? '#ef4444' : 'rgba(255,255,255,0.6)'),

            cursor: 'pointer',
            fontWeight: active ? 600 : 500,
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            textAlign: 'left',
            fontSize: '1rem',
            position: 'relative',
        }}
    >
        <span style={{
            color: active ? '#60a5fa' : 'currentColor',
            display: 'flex',
            alignItems: 'center',
            filter: active ? 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.5))' : 'none'
        }}>
            {icon}
        </span>
        <span style={{ opacity: active ? 1 : 0.9 }}>{label}</span>
    </button>
);
