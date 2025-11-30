import React from 'react';

const Callout = ({ type = 'info', title, children }) => {
  const colors = {
    info: {
      border: '#3b82f6', // blue-500
      bg: 'rgba(59, 130, 246, 0.1)',
      icon: 'ℹ️'
    },
    warning: {
      border: '#f59e0b', // amber-500
      bg: 'rgba(245, 158, 11, 0.1)',
      icon: '⚠️'
    },
    danger: {
      border: '#ef4444', // red-500
      bg: 'rgba(239, 68, 68, 0.1)',
      icon: '🚨'
    }
  };

  const style = colors[type] || colors.info;

  return (
    <div style={{
      borderLeft: `4px solid ${style.border}`,
      backgroundColor: style.bg,
      padding: '16px',
      margin: '24px 0',
      borderRadius: '0 8px 8px 0'
    }}>
      {title && (
        <div style={{ 
          fontWeight: 'bold', 
          marginBottom: '8px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          color: '#fff'
        }}>
          <span>{style.icon}</span>
          {title}
        </div>
      )}
      <div style={{ color: '#e5e7eb' }}>
        {children}
      </div>
    </div>
  );
};

export default Callout;
