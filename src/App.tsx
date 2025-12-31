import { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { InventoryList } from './components/inventory/InventoryList';
import { InventoryForm } from './components/inventory/InventoryForm';
import { TodoView } from './components/todo/TodoView';
import { useInventory } from './hooks/useInventory';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Moon, Sun, Download, LogOut, Loader2 } from 'lucide-react';
import { useInstallPrompt } from './hooks/useInstallPrompt';
import { useAuth } from './context/AuthContext';
import { AuthScreen } from './components/auth/AuthScreen';
import { auth } from './lib/firebase';
import { useCategories } from './context/CategoriesContext';
import { Trash2, Plus } from 'lucide-react';

const CategoryManager = () => {
  const { customCategories, addCategory, removeCategory } = useCategories();
  const [newCat, setNewCat] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat.trim()) {
      await addCategory(newCat.trim());
      setNewCat('');
    }
  };

  return (
    <div>
      <h3>Custom Categories</h3>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '8px', marginBottom: '12px', marginTop: '8px' }}>
        <input
          value={newCat}
          onChange={e => setNewCat(e.target.value)}
          placeholder="New Category..."
          className="glass-panel"
          style={{ flex: 1, padding: '8px' }}
        />
        <Button size="sm" type="submit"><Plus size={16} /></Button>
      </form>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {customCategories.length === 0 && <span className="text-muted" style={{ fontSize: '0.9rem' }}>No custom categories yet.</span>}
        {customCategories.map(c => (
          <div key={c.id} style={{
            background: 'rgba(0,0,0,0.05)',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {c.name}
            <button
              onClick={() => removeCategory(c.id, c.name)}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex' }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [view, setView] = useState<'inventory' | 'todo' | 'settings' | 'add'>('inventory');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const { items, addItem, deleteItem } = useInventory();
  const { isInstallable, promptToInstall } = useInstallPrompt();
  const { user, loading, userProfile, updateHousehold } = useAuth();

  // Dark Mode Effect
  useEffect(() => {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (darkMode) {
      document.documentElement.classList.add('dark');
      if (themeColorMeta) themeColorMeta.setAttribute('content', '#14171f');
    } else {
      document.documentElement.classList.remove('dark');
      if (themeColorMeta) themeColorMeta.setAttribute('content', '#f9fafb');
    }
  }, [darkMode]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="hsl(var(--color-primary))" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const renderContent = () => {
    switch (view) {
      case 'add':
        return (
          <InventoryForm
            onSubmit={(item) => {
              addItem(item);
              setView('inventory');
            }}
            onCancel={() => setView('inventory')}
          />
        );

      case 'settings':
        return (
          <div className="animate-fade-in">
            <h2 className="text-title">Settings</h2>

            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>Appearance</h3>
                <Button
                  variant="secondary"
                  onClick={() => setDarkMode(!darkMode)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </Button>
              </div>
              <hr style={{ margin: '16px 0', borderColor: 'var(--glass-border)', opacity: 0.3 }} />

              <div style={{ opacity: 0.6 }}>
                <p>App Version: 1.1.0</p>
                <p>Account: {user.email}</p>
                <p>Sync Status: Cloud (Firebase)</p>
              </div>

              <hr style={{ margin: '16px 0', borderColor: 'var(--glass-border)', opacity: 0.3 }} />

              <div>
                <h3>Family Sharing</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '8px' }}>
                  Share this code with your family to sync your list:
                </p>
                <div style={{
                  display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.05)', padding: '12px', borderRadius: '8px',
                  fontFamily: 'monospace', fontWeight: 'bold', justifyContent: 'center', marginBottom: '16px'
                }} onClick={() => {
                  navigator.clipboard.writeText(userProfile?.householdId || '');
                  alert('Code copied!');
                }}>
                  {userProfile?.householdId || 'Loading...'}
                </div>

                <details>
                  <summary style={{ cursor: 'pointer', fontSize: '0.9rem', color: 'hsl(var(--color-primary))' }}>Join a Family</summary>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    // @ts-ignore
                    const code = e.target.code.value;
                    if (code && confirm('Joining a new family will switch your view. Continue?')) {
                      await updateHousehold(code);
                      alert('You have joined the family!');
                      window.location.reload();
                    }
                  }} style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <input name="code" placeholder="Enter family code" className="glass-panel" style={{ padding: '8px', flex: 1 }} />
                    <Button size="sm" type="submit">Join</Button>
                  </form>
                </details>
              </div>

              <hr style={{ margin: '16px 0', borderColor: 'var(--glass-border)', opacity: 0.3 }} />

              <Button
                variant="secondary"
                onClick={() => auth.signOut()}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)' }}
              >
                <LogOut size={18} />
                Log Out
              </Button>

              {isInstallable && (
                <>
                  <hr style={{ margin: '16px 0', borderColor: 'var(--glass-border)', opacity: 0.3 }} />
                  <Button onClick={promptToInstall} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    <Download size={18} />
                    Install App
                  </Button>
                </>
              )}

              <hr style={{ margin: '16px 0', borderColor: 'var(--glass-border)', opacity: 0.3 }} />

              <CategoryManager />
            </Card>
          </div>
        );

      case 'todo':
        return <TodoView />;

      case 'inventory':
      default:
        return (
          <div className="animate-fade-in">
            <InventoryList
              items={items}
              onAddItem={() => setView('add')}
              onDeleteItem={deleteItem}
            />
          </div>
        );
    }
  };

  return (
    <Layout currentView={view} onNavigate={(v) => setView(v as any)}>
      {renderContent()}
    </Layout>
  )
}

export default App
