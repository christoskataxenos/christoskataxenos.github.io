/**
 * Stats Component
 * Σκοπός: Εμφάνιση στατιστικών συνεδρίας (Panic Level, Caffeine, Time Spent).
 * Δεδομένα: panicLevel, doubtLevel, coffeeCups, hoursSpent.
 * Ροή: Υπολογισμός επιπέδου (Panic/Doubt) -> Επιλογή χρώματος -> Render flex container.
 */
import React from 'react';

const Stats = ({ panicLevel, doubtLevel, coffeeCups, hoursSpent }) => {
  // Επιλογή μετρικής προς εμφάνιση
  const isDoubt = doubtLevel !== undefined;
  const level = isDoubt ? doubtLevel : panicLevel;
  const label = isDoubt ? "Doubt Level" : "Panic Level";

  // Επιλογή χρώματος βάσει ορίων (Critical > 80, Warning > 50, OK <= 50)
  const barColor = level > 80 ? '#ef4444' : level > 50 ? '#f59e0b' : '#10b981';

  return (
    <div style={{
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '16px',
      margin: '24px 0',
      backgroundColor: '#111',
      color: '#fff',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', textTransform: 'uppercase', color: '#888' }}>
        Current Session Stats
      </h3>

      {/* Flex container με row-gap για mobile wrapping */}
      <div style={{ display: 'flex', gap: '20px', rowGap: '24px', flexWrap: 'wrap' }}>

        {/* Level Bar (Panic or Doubt) */}
        <div style={{ flex: '1 1 150px' }}>
          <div style={{ fontSize: '12px', marginBottom: '4px' }}>{label}: {level}%</div>
          <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px' }}>
            <div style={{
              width: `${Math.min(level, 100)}%`,
              height: '100%',
              background: barColor,
              borderRadius: '4px',
              transition: 'all 0.5s ease-out'
            }} />
          </div>
        </div>

        {/* Caffeine Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 1 auto' }}>
          <span style={{ fontSize: coffeeCups > 20 ? '28px' : '20px', transition: 'all 0.3s' }}>☕</span>
          <div>
            <div style={{ fontSize: '12px', color: '#888' }}>Caffeine</div>
            <div style={{
              fontWeight: 'bold',
              fontSize: coffeeCups > 20 ? '16px' : '14px',
              color: coffeeCups > 20 ? '#f59e0b' : '#fff'
            }}>
              {coffeeCups} {coffeeCups > 20 ? 'MASSIVE' : ''} cups
            </div>
          </div>
        </div>

        {/* Time Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 1 auto' }}>
          <span style={{ fontSize: '20px' }}>⏱️</span>
          <div>
            <div style={{ fontSize: '12px', color: '#888' }}>Time Spent</div>
            <div style={{ fontWeight: 'bold' }}>{hoursSpent} hours</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Stats;
