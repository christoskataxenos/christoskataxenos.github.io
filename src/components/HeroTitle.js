'use client';

import styles from './HeroTitle.module.css';
import { useLanguage } from '../context/LanguageContext';
import MagneticText from './MagneticText';

export default function HeroTitle() {
  const { language } = useLanguage(); 

  const containerClassName = language === 'en' 
    ? `${styles.container} ${styles.noHoverEffect}` 
    : styles.container;

  return (
    <h1 className={containerClassName} aria-label="Christos Kataxenos">
      <MagneticText strength={0.1}>
        <span className={styles.englishLayer}>
          Christos Kataxenos
        </span>

        <span className={styles.greekLayer} aria-hidden="true">
          Χρήστος Καταξένος
        </span>
      </MagneticText>
    </h1>
  );
}
