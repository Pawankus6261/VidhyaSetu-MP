// VidyaSetu MP — App Context
// Provides: colorScheme (defaults to signature Stitch dark), network state, dialect & English support, theme tokens, translations
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useColorScheme, AppState } from 'react-native';
import { getTheme } from '../constants/theme';
import { getT } from '../constants/translations';
import { authApi, systemApi } from '../api/index.js';
import { syncEngine } from '../services/SyncEngine.js';

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

  // 2. Student Identity & Profile (Local-First DPDP Act 2023 Compliant)
  const [studentProfile, setStudentProfile] = useState({
    id: 'student_barwani_tribal_01',
    full_name: 'सुनीता सोलंकी (Sunita Solanki)',
    samagra_id: '194829104',
    social_category: 'ST',
    gender: 'FEMALE',
    district: 'Barwani',
    tehsil: 'Pati',
    college_code: 'eP_GOVT_COLLEGE_BARWANI',
    course_enrolled: 'BA',
    year_of_study: 1,
    family_annual_income: 72000.0,
    twelfth_percentage: 68.4,
    has_sambal_card: true,
    is_rural: true,
  });
  const [authToken, setAuthToken] = useState(null);

  // 3. Network state — polled via backend health or ping
  const [networkState, setNetworkState] = useState({
    isConnected: false,
    type: 'none',       // 'none' | '2g' | '3g' | 'wifi' | 'unknown'
    speed: '0 kbps',
    label: '0 kbps ऑफलाइन',
    isOnline: false,
    backendOnline: false,
  });

  // 4. Sync status tracked directly from SyncEngine
  const [syncState, setSyncState] = useState({
    pendingCount: syncEngine.getPendingCount(),
    isSyncing: false,
    lastSyncTimestamp: 0,
  });

  useEffect(() => {
    const unsub = syncEngine.addListener((state) => {
      setSyncState(state);
    });
    return unsub;
  }, []);

  const checkNetwork = async () => {
    const startTime = Date.now();
    try {
      // Check backend health first to confirm edge-cloud synchronization link
      const healthRes = await systemApi.getHealth();
      const rtt = Date.now() - startTime;

      let type = 'wifi';
      let speed = '> 1 Mbps';
      if (rtt > 2000) { type = '2g'; speed = '~40 kbps'; }
      else if (rtt > 800) { type = '3g'; speed = '~200 kbps'; }
      else if (rtt > 300) { type = '4g'; speed = '~1 Mbps'; }

      if (healthRes.isSuccess) {
        setNetworkState((prev) => {
          const wasOffline = !prev.isOnline;
          if (wasOffline) {
            // Trigger automatic sync drain when network returns
            setTimeout(() => syncEngine.drainOutbox(true), 500);
          }
          return {
            isConnected: true,
            type,
            speed,
            label: `${speed} ऑनलाइन`,
            isOnline: true,
            backendOnline: true,
          };
        });
        return;
      }

      // Fallback check to external ping
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);
      await fetch('https://www.google.com/generate_204', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache',
      });
      clearTimeout(timeout);

      setNetworkState({
        isConnected: true,
        type,
        speed,
        label: `${speed} ऑनलाइन`,
        isOnline: true,
        backendOnline: false,
      });
    } catch {
      setNetworkState({
        isConnected: false,
        type: 'none',
        speed: '0 kbps',
        label: '0 kbps ऑफलाइन',
        isOnline: false,
        backendOnline: false,
      });
    }
  };

  useEffect(() => {
    checkNetwork();
    const interval = setInterval(checkNetwork, 8000);
    return () => clearInterval(interval);
  }, []);

  // Initialize device registration silently on startup if online
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await authApi.registerDevice({
          social_category: studentProfile.social_category,
          district: studentProfile.district,
          course_enrolled: studentProfile.course_enrolled,
        });
        if (res.isSuccess && res.data?.access_token) {
          setAuthToken(res.data.access_token);
        }
      } catch (e) {
        // Safe offline startup; retains local identity
      }
    };
    initAuth();
  }, []);

  const loginWithSamagra = async (samagraId) => {
    try {
      const res = await authApi.loginSamagra(samagraId);
      if (res.isSuccess && res.data?.access_token) {
        setAuthToken(res.data.access_token);
        setStudentProfile((p) => ({ ...p, samagra_id: samagraId }));
        showToast(
          isEnglish ? `Samagra ID ${samagraId} verified!` : `समग्र आईडी ${samagraId} सत्यापित!`,
          'success'
        );
        return { success: true };
      }
      return { success: false, error: res.error?.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const syncNow = async () => {
    return syncEngine.drainOutbox(networkState.isOnline);
  };

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
  const isDark = colorScheme === 'dark';

  // 4. Civic & Academic Notifications System
  const [notifications, setNotifications] = useState([
    {
      id: 'NOTIF_1',
      title: 'MPTAAS 2026-27 छात्रवृत्ति पोर्टल खुला',
      titleEn: 'MPTAAS 2026-27 Scholarship Portal Open',
      message: 'जनजातीय कार्य विभाग द्वारा पोस्ट-मैट्रिक छात्रवृत्ति पंजीयन प्रारंभ। शत-प्रतिशत शुल्क प्रतिपूर्ति।',
      messageEn: 'Tribal Affairs Department has opened post-matric scholarship registrations. 100% tuition refund.',
      time: '10m',
      type: 'SCHEME',
      read: false,
    },
    {
      id: 'NOTIF_2',
      title: 'इतिहास मॉड्यूल 1 स्थानीय रूप से सुरक्षित',
      titleEn: 'History Module 1 Cached Locally',
      message: 'सिंधु घाटी सभ्यता (.VSMP 1.8 MB) 100% ऑफलाइन कैश सत्यापित। 0 kbps पर उपलब्ध।',
      messageEn: 'Indus Valley Civilization (.VSMP 1.8 MB) 100% offline cache verified. Ready at 0 kbps.',
      time: '1h',
      type: 'ACADEMIC',
      read: false,
    },
    {
      id: 'NOTIF_3',
      title: 'बरकतउल्ला विश्वविद्यालय अकादमिक सेल',
      titleEn: 'Barkatullah University Academic Cell',
      message: 'विशाल स्नानागार के बिटुमेन वाटरप्रूफिंग पर प्राध्यापक का ऑडियो उत्तर आउटबॉक्स से सिंक हुआ।',
      messageEn: 'Professor audio review on Great Bath bitumen waterproofing synced to your outbox.',
      time: '3h',
      type: 'ACADEMIC',
      read: false,
    },
    {
      id: 'NOTIF_4',
      title: 'संबल 2.0 कार्ड सत्यापन पूर्ण',
      titleEn: 'Sambal 2.0 Card Verified',
      message: 'समग्र आईडी 104829104 से संबल 2.0 कार्ड सत्यापित। समस्त उच्च शिक्षा शुल्क शासन वहन करेगा।',
      messageEn: 'Sambal 2.0 card linked with Samagra ID 104829104. All college fees covered by government.',
      time: '1d',
      type: 'SCHEME',
      read: true,
    }
  ]);

  const [activeToast, setActiveToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setActiveToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setActiveToast((curr) => (curr && curr.message === message ? null : curr));
    }, 3200);
  };

  const hideToast = () => setActiveToast(null);

  const addNotification = (notif) => {
    const item = {
      id: `NOTIF_${Date.now()}`,
      time: 'अभी-अभी',
      read: false,
      ...notif,
    };
    setNotifications((prev) => [item, ...prev]);
    showToast(isEnglish ? (notif.titleEn || notif.title) : notif.title, notif.type || 'info');
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider value={{
      colorScheme,
      setColorScheme,
      toggleTheme,
      isDark,
      theme,
      networkState,
      checkNetwork,
      dialect,
      setDialect,
      DIALECTS,
      t,
      isEnglish,
      notifications,
      unreadCount,
      addNotification,
      markAllRead,
      markRead,
      studentProfile,
      setStudentProfile,
      authToken,
      syncState,
      loginWithSamagra,
      syncNow,
      activeToast,
      showToast,
      hideToast,
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
