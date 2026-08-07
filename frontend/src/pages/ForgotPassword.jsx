import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Key } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { sendForgotPasswordOTP, resetPasswordWithOTP } from '../firebase/authService';
import styles from './styles/AuthLayout.module.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [email, setEmail] = useState('');
  
  // OTP State
  const [otp, setOtp] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '']);
  const [devOtpCode, setDevOtpCode] = useState(null);

  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    const { success: isSent, error: sendError, devOtp } = await sendForgotPasswordOTP(email);
    
    setIsLoading(false);
    if (sendError) {
      setError(sendError);
    } else {
      setSuccess('If the email exists, an OTP has been sent. Check your inbox!');
      setStep(2);
      if (devOtp) {
        setDevOtpCode(devOtp);
      }
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    setOtp(newDigits.join(''));
    
    // Auto focus next input
    if (value && index < 4) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    if (otp.length !== 5) {
      setError('OTP must be exactly 5 digits');
      setIsLoading(false);
      return;
    }

    const { success: isReset, error: resetError } = await resetPasswordWithOTP(email, otp, newPassword);
    
    setIsLoading(false);
    if (resetError) {
      setError(resetError);
    } else {
      setSuccess('Password reset successfully! You can now login.');
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  return (
    <div className={styles.container}>
      <style>
        {`
          @keyframes slideUpFade {
            0% { transform: translate(-50%, 40px); opacity: 0; }
            100% { transform: translate(-50%, 0); opacity: 1; }
          }
        `}
      </style>
      <div className={styles.overlay} />
      
      <button className={styles.backBtn} onClick={() => navigate('/login')}>
        <ArrowLeft size={20} />
        Back to Login
      </button>

      <div className={styles.content}>
        <GlassCard variant="purple">
          <h2 className={`${styles.title} text-gradient-purple`}>Recover Access</h2>
          
          <div className={styles.divider}>
            {step === 1 ? 'Enter your email' : 'Verify and Reset'}
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOTP}>
              <Input 
                icon={Mail} 
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && <div style={{ color: '#ff4b4b', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}
              {success && <div style={{ color: '#4ade80', marginBottom: '15px', fontSize: '14px' }}>{success}</div>}

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full" 
                style={{ width: '100%', marginTop: '10px' }}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>
                  Enter the 5-digit code we sent to your email
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      style={{
                        width: '56px',
                        height: '64px',
                        borderRadius: '8px',
                        background: 'rgba(10, 15, 30, 0.6)',
                        border: digit ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                        color: 'white',
                        fontSize: '24px',
                        textAlign: 'center',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        boxShadow: digit ? '0 0 15px var(--color-primary-glow)' : 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-primary)';
                        e.target.style.boxShadow = '0 0 15px var(--color-primary-glow)';
                      }}
                      onBlur={(e) => {
                        if (!digit) {
                          e.target.style.borderColor = 'var(--glass-border)';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {devOtpCode && (
                <div style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#e9d5ff',
                  fontSize: '14px'
                }}>
                  <div>
                    <span style={{ opacity: 0.8 }}>Dev Mode OTP: </span>
                    <span style={{ fontWeight: 'bold', letterSpacing: '2px', fontSize: '16px', color: '#fff' }}>{devOtpCode}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setOtpDigits(devOtpCode.split(''));
                      setOtp(devOtpCode);
                    }}
                    style={{
                      background: 'rgba(168, 85, 247, 0.2)',
                      color: '#d8b4fe',
                      border: '1px solid rgba(168, 85, 247, 0.4)',
                      padding: '6px 16px',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'rgba(168, 85, 247, 0.4)';
                      e.target.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'rgba(168, 85, 247, 0.2)';
                      e.target.style.color = '#d8b4fe';
                    }}
                  >
                    Fill
                  </button>
                </div>
              )}

              <Input 
                icon={Lock} 
                type="password" 
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              {error && <div style={{ color: '#ff4b4b', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}
              {success && <div style={{ color: '#4ade80', marginBottom: '15px', fontSize: '14px' }}>{success}</div>}

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full" 
                style={{ width: '100%', marginTop: '10px' }}
                disabled={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </GlassCard>
      </div>

    </div>
  );
}
