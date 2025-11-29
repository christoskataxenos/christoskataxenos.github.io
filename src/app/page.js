'use client';

import HeroTitle from '../components/HeroTitle';
import { UserIcon, CodeIcon, CameraIcon } from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';
import SpotlightCard from '../components/SpotlightCard';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="scroll-container">
      {/* Section 1: Hero */}
      <section id="hero" className="section hero-section">
        <div className="hero-content">
          <HeroTitle />
          <p className="hero-description max-w-2xl mx-auto">
            {t.heroDescription}
          </p>
        </div>
        <div className="scroll-down-indicator">
          <span></span>
        </div>
      </section>

      {/* Section 2: Biography */}
      <section id="bio" className="section content-section">
        <div className="card-wrapper">
          {/* ΑΛΛΑΓΗ 1: Μόνο κάθετος και το όνομα */}
          <SpotlightCard href="/bio">
            <div className="card-icon">
              <UserIcon />
            </div>
            <span className="card-title">{t.bioTitle}</span>
          </SpotlightCard>
          <p className="code-caption">{'//'} {t.bioCaption}</p>
        </div>
      </section>

      {/* Section 3: Dev Blog */}
      <section id="blog" className="section content-section">
        <div className="card-wrapper">
          {/* ΑΛΛΑΓΗ 2: Μόνο κάθετος και το όνομα */}
          <SpotlightCard href="/blog">
            <div className="card-icon">
              <CodeIcon />
            </div>
            <span className="card-title">{t.blogTitle}</span>
          </SpotlightCard>
          <p className="code-caption">{'//'} {t.blogCaption}</p>
        </div>
      </section>

      {/* Section 4: Photography Portfolio */}
      <section id="portfolio" className="section content-section">
        <div className="card-wrapper">
          {/* ΑΛΛΑΓΗ 3: Μόνο κάθετος και το όνομα */}
          <SpotlightCard href="/portfolio">
            <div className="card-icon">
              <CameraIcon />
            </div>
            <span className="card-title">{t.photoTitle}</span>
          </SpotlightCard>
          <p className="code-caption">{'//'} {t.photoCaption}</p>
        </div>
      </section>

    </div>
  );
}