import { motion } from 'framer-motion';
import styles from './styles/Button.module.css';

export default function Button({ children, variant = 'primary', onClick, type = 'button', className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${styles.btn} ${styles[variant]} ${className}`}
      onClick={onClick}
      type={type}
      {...props}
    >
      <span className={styles.content}>{children}</span>
      {variant !== 'ghost' && (
        <div className={styles.shimmer} />
      )}
    </motion.button>
  );
}
