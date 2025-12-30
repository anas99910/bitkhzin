import React from 'react';
import { Package, Settings, LogOut, CheckSquare } from 'lucide-react';

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
                        HI
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
                        icon={<CheckSquare size={20} />}
                        label="To-Do"
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
                    <NavItem icon={<LogOut size={20} />} label="Sign Out" />
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '20px', maxWidth: '100%', paddingBottom: '90px' }}>
                {children}
            </main>

            {/* Bottom Nav - Mobile */}
            <nav
                className="mobile-nav glass-panel mobile-only"
                style={{
                    position: 'fixed',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    padding: '12px 20px',
                    display: 'flex',
                    justifyContent: 'space-around',
                    zIndex: 50,
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(20px)',
                    borderTop: '1px solid var(--glass-border)',
                    borderRadius: '20px 20px 0 0',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
                }}
            >
                <NavItem
                    icon={<Package size={24} />}
                    label="Inventory"
                    active={currentView === 'inventory'}
                    onClick={() => onNavigate?.('inventory')}
                    vertical
                />
                <NavItem
                    icon={<CheckSquare size={24} />}
                    label="To-Do"
                    active={currentView === 'todo'}
                    onClick={() => onNavigate?.('todo')}
                    vertical
                />
                <NavItem
                    icon={<Settings size={24} />}
                    label="Settings"
                    active={currentView === 'settings'}
                    onClick={() => onNavigate?.('settings')}
                    vertical
                />
            </nav>

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
