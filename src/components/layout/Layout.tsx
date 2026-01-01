import React from 'react';
import { Package, Settings, LogOut, ShoppingCart, Box } from 'lucide-react';
import { auth } from '../../lib/firebase';

interface LayoutProps {
    children: React.ReactNode;
    currentView?: string;
    onNavigate?: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView = 'inventory', onNavigate }) => {
    return (
        <div className="layout-container" style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar - Desktop (Pill Design) */}
            <aside
                className="glass-panel sidebar desktop-only"
                style={{
                    width: '80px',
                    margin: '24px 0 24px 24px', // Floating left
                    height: 'calc(100vh - 48px)',
                    position: 'sticky',
                    top: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '32px 16px',
                    borderRadius: '40px', // Pill shape
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--shadow-lg)'
                }}
            >
                {/* Logo */}
                <div style={{ marginBottom: 'auto', display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        width: '56px', height: '56px',
                        background: 'linear-gradient(135deg, hsl(var(--color-primary)), #8b5cf6)',
                        borderRadius: '18px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4), inset 0 1px 1px rgba(255,255,255,0.4)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <Box size={28} strokeWidth={2.5} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                    </div>
                </div>

                {/* Nav Items - Middle */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, justifyContent: 'center' }}>
                    <NavItem
                        icon={<Package size={26} />}
                        label="Inventory"
                        active={currentView === 'inventory'}
                        onClick={() => onNavigate?.('inventory')}
                        showLabel={false}
                    />
                    <NavItem
                        icon={<ShoppingCart size={26} />}
                        label="Shopping List"
                        active={currentView === 'todo'}
                        onClick={() => onNavigate?.('todo')}
                        showLabel={false}
                    />
                    <NavItem
                        icon={<Settings size={26} />}
                        label="Settings"
                        active={currentView === 'settings'}
                        onClick={() => onNavigate?.('settings')}
                        showLabel={false}
                    />
                </nav>

                {/* Bottom Actions */}
                <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--glass-border)', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <NavItem
                        icon={<LogOut size={24} />}
                        label="Sign Out"
                        onClick={() => auth.signOut()}
                        active={false}
                        showLabel={false}
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
                <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                    {children}
                </div>
            </main>

            {/* Bottom Nav - Mobile */}
            <div className="mobile-nav-container mobile-only" style={{ position: 'fixed', bottom: 0, zIndex: 50 }}>
                <ul className="nav-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', width: '100%' }}>

                    <li className={`nav-item ${currentView === 'inventory' ? 'active' : ''}`} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <button className={`nav-link ${currentView === 'inventory' ? 'active' : ''}`} onClick={() => onNavigate?.('inventory')}>
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
                            left: `calc(100% / 3 * ${currentView === 'inventory' ? 0 : currentView === 'todo' ? 1 : 2} + 100% / 6 - 35px)`
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
    vertical?: boolean;
    showLabel?: boolean;
    danger?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick, vertical = false, showLabel = true, danger = false }) => (
    <button
        onClick={onClick}
        title={label}
        className="tap-scale"
        style={{
            display: 'flex',
            flexDirection: vertical ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center', // Center icon
            gap: (showLabel || vertical) ? '12px' : '0',
            padding: '12px',
            width: showLabel ? '100%' : '56px',
            height: showLabel ? 'auto' : '56px',
            borderRadius: '18px',
            border: 'none',
            background: active ? 'hsl(var(--color-primary))' : 'transparent',
            color: active ? 'white' : (danger ? '#ef4444' : 'var(--text-muted)'),
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            textAlign: vertical ? 'center' : 'left',
            fontSize: vertical ? '0.75rem' : '1rem',
            position: 'relative',
            boxShadow: active ? '0 8px 16px rgba(59, 130, 246, 0.25)' : 'none'
        }}
    >
        {icon}
        {showLabel && <span>{label}</span>}
        {/* Tooltip for icon only mode could be added here if needed */}
    </button>
);
