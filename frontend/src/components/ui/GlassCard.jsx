import { motion } from 'framer-motion';
import styles from './styles/GlassCard.module.css';

export default function GlassCard({ children, variant = 'default', className = '', ...props }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${styles.card} ${styles[variant] || ''} ${className}`}
      {...props}
    >
      <div className={styles.cornerTopLeft} />
      <div className={styles.cornerTopRight} />
      <div className={styles.cornerBottomLeft} />
      <div className={styles.cornerBottomRight} />
      
      {children}
    </motion.div>
  );
}
