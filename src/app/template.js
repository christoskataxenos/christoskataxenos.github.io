'use client';

import React from 'react';

/**
 * Next.js Template component
 * In App Router, template.js is similar to layout.js but it re-renders on every navigation.
 * This makes it the perfect place for entry animations without heavy libraries.
 */
export default function Template({ children }) {
  return (
    <div className="page-transition-wrapper">
      {children}
    </div>
  );
}
