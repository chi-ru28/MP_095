import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { Settings } from 'lucide-react';
import Button from '../components/ui/Button';
import styles from './styles/Splash.module.css';

export default function Splash() {
  const navigate = useNavigate();
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      await controls.start('visible');
    };
    sequence();
  }, [controls]);

  const handleStart = () => {
    // Play button animation/sound if any
    navigate('/login');
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
        delayChildren: 1, // Wait for background/portal
      }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1, ease: "easeOut" }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      
      {/* UI Content */}
      <motion.div 
        className={styles.topBar}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <select className={styles.languageSelect}>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
        
        <button className={styles.settingsBtn}>
          <Settings size={24} />
        </button>
      </motion.div>

      <motion.div 
        className={styles.centerContent}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
      >
        <motion.h1 variants={fadeUp} className={`${styles.logo} text-gradient-gold`}>
          ASCENDRA
        </motion.h1>
        
        <motion.p variants={fadeUp} className={styles.subtitle}>
          AI-Powered Adventure Game <br/>
          for Personalized Skill Development
        </motion.p>
        
        <motion.div variants={fadeUp} className={styles.startBtnContainer}>
          <Button variant="gold" onClick={handleStart}>
            Start Game
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        className={styles.bottomNav}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
      >
        <div className={styles.navLink}>Journal</div>
        <div className={styles.navLink}>Leaderboard</div>
        <div className={styles.navLink}>Store</div>
        <div className={styles.navLink}>Exit Game</div>
      </motion.div>

      <div className={styles.footer}>
        <span>Version 1.0.0</span>
        <span>&copy; 2026 ASCENDRA</span>
      </div>
    </div>
  );
}
