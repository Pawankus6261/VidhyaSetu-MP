// VidyaSetu MP — Root App Entry
// Auto-detects: system theme (light/dark), network status (online/offline)
// Adaptive for any screen: Mobile (320px-440px), Tablets (768px+), Foldables, and Web Desktops (1024px+)
// Real Vector Icons via @expo/vector-icons, Optimistic UI Navigation, Dedicated Settings Screen
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
import { Ionicons } from '@expo/vector-icons';

import { AppProvider, useApp } from './src/context/AppContext';
import AppHeader from './src/components/AppHeader';
import SplashScreen from './src/screens/SplashScreen';
import LearnScreen from './src/screens/LearnScreen';
import ScholarshipScreen from './src/screens/ScholarshipScreen';
import DoubtScreen from './src/screens/DoubtScreen';
import CareerScreen from './src/screens/CareerScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NotificationModal from './src/components/NotificationModal';
import ToastBanner from './src/components/ToastBanner';
import { RADIUS, FONT } from './src/constants/theme';

function AppShell() {
  const { theme, colorScheme, t } = useApp();
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;

  const [showSplash, setShowSplash] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('LEARN');

  const s = makeStyles(theme, width, height, isTablet, isDesktop);

  const TABS = [
    {
      key: 'LEARN',
      iconActive: 'book',
      iconInactive: 'book-outline',
      label: t.tabs.learn,
    },
    {
      key: 'SCHOLARSHIP',
      iconActive: 'cash',
      iconInactive: 'cash-outline',
      label: t.tabs.scholarship,
    },
    {
      key: 'DOUBT',
      iconActive: 'chatbubble-ellipses',
      iconInactive: 'chatbubble-ellipses-outline',
      label: t.tabs.doubt,
    },
    {
      key: 'CAREER',
      iconActive: 'compass',
      iconInactive: 'compass-outline',
      label: t.tabs.career,
    },
    {
      key: 'SETTINGS',
      iconActive: 'settings',
      iconInactive: 'settings-outline',
      label: t.tabs.settings,
    },
  ];

  const renderScreen = () => {
    switch (activeTab) {
      case 'LEARN':       return <LearnScreen />;
      case 'SCHOLARSHIP': return <ScholarshipScreen />;
      case 'DOUBT':       return <DoubtScreen />;
      case 'CAREER':      return <CareerScreen />;
      case 'SETTINGS':    return <SettingsScreen onOpenSplash={() => setShowSplash(true)} />;
      default:            return <LearnScreen />;
    }
  };

  if (showSplash) {
    return (
      <SafeAreaView style={s.safeAreaSplash}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#080E1C"
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

      {/* FLOATING IN-APP TOAST */}
      <ToastBanner />

      {/* ADAPTIVE CONTAINER: Centers content on tablets & desktops */}
      <View style={s.outerContainer}>
        <View style={s.adaptiveContainer}>
          {/* MINIMALIST GLOBAL HEADER */}
          <AppHeader
            onOpenSettings={() => setActiveTab('SETTINGS')}
            onOpenHome={() => setActiveTab('LEARN')}
            onOpenNotifications={() => setShowNotifications(true)}
          />

          {/* SCREEN CONTENT */}
          <View style={s.content}>
            {renderScreen()}
          </View>

          {/* NOTIFICATION MODAL */}
          <NotificationModal
            visible={showNotifications}
            onClose={() => setShowNotifications(false)}
          />

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
                    activeOpacity={0.7}
                  >
                    <View style={[s.iconBox, active && s.iconBoxActive]}>
                      <Ionicons
                        name={active ? tab.iconActive : tab.iconInactive}
                        size={20}
                        color={active ? theme.primaryLight : theme.chromeTextMuted}
                      />
                    </View>
                    <Text style={[s.tabLabel, active && s.tabLabelActive]}>
                      {tab.label}
                    </Text>
                    {active && <View style={s.activePip} />}
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
      backgroundColor: '#080E1C',
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
      elevation: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    tabBar: {
      flexDirection: 'row',
      height: Platform.OS === 'ios' ? 68 : 60,
      paddingHorizontal: isTablet ? 24 : 6,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 4,
      borderRadius: RADIUS.md,
      marginHorizontal: 2,
      maxWidth: isTablet ? 130 : undefined,
      position: 'relative',
    },
    tabItemActive: {
      backgroundColor: 'rgba(245, 158, 11, 0.08)',
    },
    iconBox: {
      width: 28,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconBoxActive: {
      transform: [{ scale: 1.05 }],
    },
    tabLabel: {
      fontSize: 10,
      color: theme.chromeTextMuted,
      marginTop: 2,
      fontWeight: FONT.weights.semibold,
      letterSpacing: 0.2,
    },
    tabLabelActive: {
      color: theme.primaryLight,
      fontWeight: FONT.weights.extrabold,
    },
    activePip: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.primaryLight,
      marginTop: 2,
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
