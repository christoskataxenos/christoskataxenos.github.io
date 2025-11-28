import React from 'react';
import { MouseProvider } from '../context/MouseContext';
import { LanguageProvider } from '../context/LanguageContext';
import ScrollProgressIndicator from './ScrollProgressIndicator';

export function Providers({ children }) {
  return (
    <LanguageProvider>
      <MouseProvider>
        <ScrollProgressIndicator />
        {children}
      </MouseProvider>
    </LanguageProvider>
  );
}
