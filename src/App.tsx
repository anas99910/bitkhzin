import { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { InventoryList } from './components/inventory/InventoryList';
import { InventoryForm } from './components/inventory/InventoryForm';
import { TodoView } from './components/todo/TodoView';
import { useInventory } from './hooks/useInventory';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Moon, Sun } from 'lucide-react';

function App() {
  const [view, setView] = useState<'inventory' | 'todo' | 'settings' | 'add'>('inventory');
  const [darkMode, setDarkMode] = useState(false);
  const { items, addItem, deleteItem } = useInventory();

  // Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
                <p>App Version: 1.0.1</p>
                <p>Sync Status: Local Storage</p>
              </div>
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
