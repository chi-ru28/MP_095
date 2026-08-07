import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './styles/Input.module.css';

export default function Input({ 
  label, 
  type = 'text', 
  icon: Icon, 
  error, 
  ...props 
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputContainer}>
        {Icon && <Icon className={styles.icon} size={20} />}
        <input 
          type={inputType} 
          className={`${styles.input} ${error ? styles.error : ''}`} 
          {...props} 
        />
        {isPassword && (
          <button 
            type="button" 
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
