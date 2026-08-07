import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import { logoutUser } from '../firebase/authService';
import Button from '../components/ui/Button';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Basic protection (ideally handled in a ProtectedRoute component)
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !user) {
    return <div style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <div style={{ padding: '40px', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 className="font-fantasy text-gradient-gold" style={{ fontSize: '32px' }}>ASCENDRA Dashboard</h1>
        <Button variant="ghost" onClick={handleLogout}>Log out</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>
        {/* User Profile Summary */}
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <img 
            src={user.photoURL} 
            alt="Avatar" 
            style={{ width: '120px', height: '120px', borderRadius: '50%', border: '2px solid var(--color-primary)', margin: '0 auto 20px' }}
          />
          <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>{user.name}</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>@{user.username}</p>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Level</div>
              <div style={{ fontSize: '24px', color: 'var(--color-primary)', fontWeight: 'bold' }}>{user.level}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Coins</div>
              <div style={{ fontSize: '24px', color: 'var(--color-accent)', fontWeight: 'bold' }}>{user.coins}</div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="glass-panel-blue" style={{ padding: '40px', borderRadius: '16px', background: 'var(--glass-bg)' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Welcome back, Adventurer!</h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            The realm of Ascendra awaits your return. Your skills have grown, but the challenges ahead will require even more dedication. Are you ready to continue your journey?
          </p>
          
          <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
            <Button variant="primary">Enter Realm</Button>
            <Button variant="gold">View Quests</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
