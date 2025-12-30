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
            {/* Sidebar - Desktop */}
            <aside
                className="glass-panel sidebar desktop-only"
                style={{
                    width: '280px',
                    margin: '20px',
                    height: 'calc(100vh - 40px)',
                    position: 'sticky',
                    top: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '24px'
                }}
            >
                <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        background: 'hsl(var(--color-primary))',
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 'bold'
                    }}>
                        <Box size={24} strokeWidth={2.5} />
                    </div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Bit Khzin</h1>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <NavItem
                        icon={<Package size={20} />}
                        label="Inventory"
                        active={currentView === 'inventory'}
                        onClick={() => onNavigate?.('inventory')}
                    />
                    <NavItem
                        icon={<ShoppingCart size={20} />}
                        label="Shopping List"
                        active={currentView === 'todo'}
                        onClick={() => onNavigate?.('todo')}
                    />
                    <NavItem
                        icon={<Settings size={20} />}
                        label="Settings"
                        active={currentView === 'settings'}
                        onClick={() => onNavigate?.('settings')}
                    />
                </nav>

                <div style={{ paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
                    <NavItem
                        icon={<LogOut size={20} />}
                        label="Sign Out"
                        onClick={() => auth.signOut()}
                        active={false}
                    />
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '20px', maxWidth: '100%', paddingBottom: '90px' }}>
                {children}
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
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
        </div>
    );
};

const NavItem = ({ icon, label, active = false, onClick, vertical = false }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, vertical?: boolean }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            flexDirection: vertical ? 'column' : 'row',
            alignItems: 'center',
            gap: vertical ? '4px' : '12px',
            padding: '12px 16px',
            width: vertical ? 'auto' : '100%',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: (!vertical && active) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            color: active ? 'hsl(var(--color-primary))' : 'inherit',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s',
            textAlign: vertical ? 'center' : 'left',
            fontSize: vertical ? '0.75rem' : '1rem',
            opacity: (!active && vertical) ? 0.6 : 1
        }}
    >
        {icon}
        {label && <span>{label}</span>}
    </button>
);
