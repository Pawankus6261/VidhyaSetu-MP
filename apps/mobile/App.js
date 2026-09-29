// VidyaSetu MP — Root App Entry
// Auto-detects: system theme (light/dark), network status (online/offline)
// Adaptive for any screen: Mobile (320px-440px), Tablets (768px+), Foldables, and Web Desktops (1024px+)
// Reloads directly into the active app screen; Splash available via header intro or first launch
import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';

import { AppProvider, useApp } from './src/context/AppContext';
import AppHeader from './src/components/AppHeader';
import SplashScreen from './src/screens/SplashScreen';
import LearnScreen from './src/screens/LearnScreen';
import ScholarshipScreen from './src/screens/ScholarshipScreen';
import DoubtScreen from './src/screens/DoubtScreen';
import CareerScreen from './src/screens/CareerScreen';

function AppShell() {
  const { theme, colorScheme, t, isEnglish } = useApp();
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;

  // Defaults to false so reloading immediately shows the interactive app!
  const [showSplash, setShowSplash] = useState(false);
  const [activeTab, setActiveTab] = useState('LEARN');

  const s = makeStyles(theme, width, height, isTablet, isDesktop);

  const TABS = [
    { key: 'LEARN',       icon: '📖', labelHi: 'पाठशाला',    labelEn: 'Learn',       label: t.tabs.learn },
    { key: 'SCHOLARSHIP', icon: '💰', labelHi: 'छात्रवृत्ति', labelEn: 'Grants',      label: t.tabs.scholarship },
    { key: 'DOUBT',       icon: '❓', labelHi: 'संदेह',       labelEn: 'Doubts',      label: t.tabs.doubt },
    { key: 'CAREER',      icon: '🧭', labelHi: 'करियर',       labelEn: 'Careers',     label: t.tabs.career },
  ];

  const renderScreen = () => {
    switch (activeTab) {
      case 'LEARN':       return <LearnScreen />;
      case 'SCHOLARSHIP': return <ScholarshipScreen />;
      case 'DOUBT':       return <DoubtScreen />;
      case 'CAREER':      return <CareerScreen />;
      default:            return <LearnScreen />;
    }
  };

  if (showSplash) {
    return (
      <SafeAreaView style={s.safeAreaSplash}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0A192F"
        />
        <SplashScreen onStart={() => setShowSplash(false)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'light-content'}
        backgroundColor={theme.chromeBackground}
      />

      {/* ADAPTIVE CONTAINER: Centers content on tablets & desktops */}
      <View style={s.outerContainer}>
        <View style={s.adaptiveContainer}>
          {/* GLOBAL HEADER WITH SPLASH RE-OPEN HOOK */}
          <AppHeader onOpenSplash={() => setShowSplash(true)} />

          {/* SCREEN CONTENT */}
          <View style={s.content}>
            {renderScreen()}
          </View>

          {/* BOTTOM DOCK NAVIGATION BAR */}
          <View style={s.tabBarContainer}>
            <View style={s.tabBar}>
              {TABS.map((tab) => {
                const active = activeTab === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[s.tabItem, active && s.tabItemActive]}
                    onPress={() => setActiveTab(tab.key)}
                    activeOpacity={0.8}
                  >
                    <View style={[s.iconBox, active && s.iconBoxActive]}>
                      <Text style={[s.tabIcon, active && s.tabIconActive]}>{tab.icon}</Text>
                    </View>
                    <Text style={[s.tabLabel, active && s.tabLabelActive]}>
                      {tab.label}
                    </Text>
                    <Text style={[s.tabSubLabel, active && s.tabSubLabelActive]}>
                      {isEnglish ? tab.labelHi : tab.labelEn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (theme, width, height, isTablet, isDesktop) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.chromeBackground,
    },
    safeAreaSplash: {
      flex: 1,
      backgroundColor: '#0A192F',
    },
    outerContainer: {
      flex: 1,
      backgroundColor: theme.chromeBackground,
      alignItems: 'center',
    },
    adaptiveContainer: {
      flex: 1,
      width: '100%',
      maxWidth: isDesktop ? 860 : (isTablet ? 720 : '100%'),
      backgroundColor: theme.background,
      elevation: isTablet ? 8 : 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isTablet ? 0.35 : 0,
      shadowRadius: isTablet ? 12 : 0,
      borderLeftWidth: isTablet ? 1 : 0,
      borderRightWidth: isTablet ? 1 : 0,
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    content: {
      flex: 1,
      backgroundColor: theme.background,
    },
    tabBarContainer: {
      backgroundColor: theme.chromeBackground,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.08)',
      elevation: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    tabBar: {
      flexDirection: 'row',
      height: Platform.OS === 'ios' ? 70 : 64,
      paddingHorizontal: isTablet ? 24 : 8,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 4,
      borderRadius: 12,
      marginHorizontal: 3,
      maxWidth: isTablet ? 140 : undefined,
    },
    tabItemActive: {
      backgroundColor: 'rgba(245, 158, 11, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.35)',
    },
    iconBox: {
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
    },
    iconBoxActive: {
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
    },
    tabIcon: {
      fontSize: 16,
      opacity: 0.65,
    },
    tabIconActive: {
      opacity: 1,
    },
    tabLabel: {
      fontSize: 11,
      color: theme.chromeTextMuted,
      marginTop: 1,
      fontWeight: '600',
    },
    tabLabelActive: {
      color: theme.primaryLight,
      fontWeight: '800',
    },
    tabSubLabel: {
      fontSize: 8.5,
      color: '#64748B',
      marginTop: -1,
    },
    tabSubLabelActive: {
      color: '#FDE68A',
      fontWeight: '600',
    },
  });

// Root export — wraps everything in AppProvider
export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
