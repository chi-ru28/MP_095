import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, User, AtSign } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { signInWithGoogle, registerWithEmail } from '../firebase/authService';
import styles from './styles/AuthLayout.module.css';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. The magical seals must align.");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    
    const { user, error } = await registerWithEmail(
      formData.email, 
      formData.password, 
      formData.fullName, 
      formData.username
    );
    
    setIsLoading(false);
    
    if (error) {
      setError(error);
    } else if (user) {
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    const { user, error } = await signInWithGoogle();
    
    if (error) {
      setError(error);
    } else if (user) {
      navigate('/dashboard');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      
      <button className={styles.backBtn} onClick={() => navigate('/')}>
        <ArrowLeft size={20} />
        Back to Splash
      </button>

      <div className={styles.content}>
        <GlassCard variant="gold">
          <h2 className={`${styles.title} text-gradient-gold`}>Join the Guild</h2>
          
          <button className={styles.googleBtn} onClick={handleGoogleLogin} type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.81 15.69 17.61V20.35H19.26C21.35 18.43 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
              <path d="M12 23C14.97 23 17.46 22.02 19.26 20.35L15.69 17.61C14.71 18.27 13.46 18.66 12 18.66C9.18 18.66 6.78 16.75 5.88 14.21H2.21V17.06C4.01 20.64 7.69 23 12 23Z" fill="#34A853"/>
              <path d="M5.88 14.21C5.65 13.53 5.52 12.78 5.52 12C5.52 11.22 5.65 10.47 5.88 9.79V6.94H2.21C1.46 8.44 1.03 10.16 1.03 12C1.03 13.84 1.46 15.56 2.21 17.06L5.88 14.21Z" fill="#FBBC05"/>
              <path d="M12 5.34C13.62 5.34 15.07 5.9 16.21 6.99L19.34 3.86C17.46 2.11 14.97 1 12 1C7.69 1 4.01 3.36 2.21 6.94L5.88 9.79C6.78 7.25 9.18 5.34 12 5.34Z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className={styles.divider}>Or create an account</div>

          <form onSubmit={handleRegister}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Input 
                icon={User} 
                name="fullName"
                type="text" 
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <Input 
                icon={AtSign} 
                name="username"
                type="text" 
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <Input 
              icon={Mail} 
              name="email"
              type="email" 
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <Input 
              icon={Lock} 
              name="password"
              type="password" 
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input 
              icon={Lock} 
              name="confirmPassword"
              type="password" 
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            
            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms" style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                I accept the ancient terms and conditions.
              </label>
            </div>

            {error && <div style={{ color: '#ff4b4b', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

            <Button 
              type="submit" 
              variant="gold" 
              style={{ width: '100%', marginTop: '10px' }}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className={styles.links} style={{ justifyContent: 'center' }}>
            <span className={styles.link} onClick={() => navigate('/login')}>Already have an account? Login</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
