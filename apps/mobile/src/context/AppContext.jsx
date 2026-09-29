// VidyaSetu MP — App Context
// Provides: colorScheme (defaults to signature Stitch dark), network state, dialect & English support, theme tokens, translations
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useColorScheme, AppState } from 'react-native';
import { getTheme } from '../constants/theme';
import { getT } from '../constants/translations';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // 1. Signature Stitch Luminous Slate Dark theme by default
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState('dark');

  const toggleTheme = () => {
    setColorScheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Follow app state foregrounding
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        // keep current user preference, fallback to dark
      }
    });
    return () => sub.remove();
  }, []);

  const theme = getTheme(colorScheme);

  // 2. Network state — polled via fetch ping
  const [networkState, setNetworkState] = useState({
    isConnected: false,
    type: 'none',       // 'none' | '2g' | '3g' | 'wifi' | 'unknown'
    speed: '0 kbps',
    label: '0 kbps ऑफलाइन',
    isOnline: false,
  });

  const checkNetwork = async () => {
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);
      await fetch('https://www.google.com/generate_204', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache',
      });
      clearTimeout(timeout);
      const rtt = Date.now() - startTime;
      let type = 'wifi';
      let speed = '> 1 Mbps';
      if (rtt > 2000) { type = '2g'; speed = '~40 kbps'; }
      else if (rtt > 800) { type = '3g'; speed = '~200 kbps'; }
      else if (rtt > 300) { type = '4g'; speed = '~1 Mbps'; }
      setNetworkState({
        isConnected: true,
        type,
        speed,
        label: `${speed} ऑनलाइन`,
        isOnline: true,
      });
    } catch {
      setNetworkState({
        isConnected: false,
        type: 'none',
        speed: '0 kbps',
        label: '0 kbps ऑफलाइन',
        isOnline: false,
      });
    }
  };

  useEffect(() => {
    checkNetwork();
    const interval = setInterval(checkNetwork, 8000);
    return () => clearInterval(interval);
  }, []);

  // 3. Dialect & Languages — 6 supported options including English!
  const [dialect, setDialect] = useState('hi');
  const DIALECTS = [
    { code: 'hi',  label: 'हिंदी', sub: 'मानक हिंदी' },
    { code: 'en',  label: 'English', sub: 'Standard' },
    { code: 'nim', label: 'निमाड़ी', sub: 'खरगोन-खंडवा' },
    { code: 'mal', label: 'मालवी', sub: 'उज्जैन-इंदौर' },
    { code: 'bun', label: 'बुंदेली', sub: 'सागर-टीकमगढ़' },
    { code: 'bhi', label: 'भीली', sub: 'झाबुआ-बड़वानी' },
  ];

  const t = getT(dialect);
  const isEnglish = dialect === 'en';

  return (
    <AppContext.Provider value={{
      colorScheme,
      setColorScheme,
      toggleTheme,
      theme,
      networkState,
      checkNetwork,
      dialect,
      setDialect,
      DIALECTS,
      t,
      isEnglish,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
