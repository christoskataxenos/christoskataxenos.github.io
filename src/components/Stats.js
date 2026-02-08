import React from 'react';

const Stats = ({ panicLevel, doubtLevel, coffeeCups, hoursSpent }) => {
  // Determine which metric to show
  const isDoubt = doubtLevel !== undefined;
  const level = isDoubt ? doubtLevel : panicLevel;
  const label = isDoubt ? "Doubt Level" : "Panic Level";
  
  // Χρώμα μπάρας ανάλογα με το επίπεδο
  const barColor = level > 80 ? '#ef4444' : level > 50 ? '#f59e0b' : '#10b981';

  return (
    <div style={{
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '16px',
      margin: '24px 0',
      backgroundColor: '#111', // Dark mode background
      color: '#fff',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', textTransform: 'uppercase', color: '#888' }}>
        Current Session Stats
      </h3>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* Level Bar (Panic or Doubt) */}
        <div style={{ flex: 1, minWidth: '150px' }}>
          <div style={{ fontSize: '12px', marginBottom: '4px' }}>{label}: {level}%</div>
          <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px' }}>
            <div style={{
              width: `${level}%`,
              height: '100%',
              background: barColor,
              borderRadius: '4px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        {/* Coffee Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>☕</span>
          <div>
            <div style={{ fontSize: '12px', color: '#888' }}>Caffeine</div>
            <div style={{ fontWeight: 'bold' }}>{coffeeCups} cups</div>
          </div>
        </div>

        {/* Time Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
