// VidyaSetu MP — Minimalist Executive Civic Header
// Features: Knowledge Torch Emblem, Live Network Indicator, Settings Action Hook
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { SPACING, RADIUS, FONT } from '../constants/theme';

export default function AppHeader({ onOpenSettings, onOpenHome, onOpenNotifications }) {
  const { theme, networkState, unreadCount, t, isEnglish } = useApp();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const s = makeStyles(theme, isTablet);

  return (
    <View style={s.headerContainer}>
      <View style={s.contentRow}>
        {/* Brand Group — Navigates to Home / Learn */}
        <TouchableOpacity
          style={s.brandGroup}
          onPress={onOpenHome}
          activeOpacity={0.8}
        >
          <View style={s.emblemBox}>
            <Image
              source={require('../../assets/adaptive-icon.png')}
              style={s.emblemImage}
              resizeMode="contain"
            />
          </View>
          <View style={s.brandInfo}>
            <View style={s.titleRow}>
              <Text style={s.brandTitle}>{t.appTitle}</Text>
              <View style={s.govtBadge}>
                <Text style={s.govtBadgeText}>MP GOVT</Text>
              </View>
            </View>
            <Text style={s.brandSubtitle} numberOfLines={1}>
              {isEnglish ? 'Higher Education EdOS' : 'उच्च शिक्षा ऑपरेटिंग सिस्टम'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Action Controls: Network State + Notification Bell + Settings Gear */}
        <View style={s.actionsCluster}>
          {/* Live Network Capsule */}
          <View
            style={[
              s.networkCapsule,
              {
                borderColor: networkState.isOnline
                  ? 'rgba(16, 185, 129, 0.4)'
                  : 'rgba(245, 158, 11, 0.35)',
                backgroundColor: networkState.isOnline
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(245, 158, 11, 0.08)',
              },
            ]}
          >
            <Ionicons
              name={networkState.isOnline ? 'wifi' : 'cloud-offline-outline'}
              size={12}
              color={networkState.isOnline ? '#34D399' : '#FBBF24'}
            />
            <Text
              style={[
                s.networkText,
                { color: networkState.isOnline ? '#34D399' : '#FBBF24' },
              ]}
            >
              {networkState.isOnline ? networkState.speed : '0 kbps'}
            </Text>
          </View>

          {/* Notification Bell Button */}
          {onOpenNotifications && (
            <TouchableOpacity
              style={s.bellButton}
              onPress={onOpenNotifications}
              activeOpacity={0.7}
              accessibilityLabel="Open Notifications"
            >
              <Ionicons
                name={unreadCount > 0 ? 'notifications' : 'notifications-outline'}
                size={17}
                color={unreadCount > 0 ? theme.primaryLight : theme.chromeTextMuted}
              />
              {unreadCount > 0 && (
                <View style={s.bellBadge}>
                  <Text style={s.bellBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* Settings Screen Toggle Button */}
          {onOpenSettings && (
            <TouchableOpacity
              style={s.settingsButton}
              onPress={onOpenSettings}
              activeOpacity={0.7}
              accessibilityLabel="Open Settings"
            >
              <Ionicons name="settings-outline" size={17} color={theme.primaryLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const makeStyles = (theme, isTablet) =>
  StyleSheet.create({
    headerContainer: {
      backgroundColor: theme.chromeBackground,
      paddingTop: SPACING.sm + 2,
      paddingBottom: SPACING.sm + 2,
      borderBottomWidth: 1,
      borderBottomColor: theme.chromeBorder,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
    },
    contentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: isTablet ? SPACING.lg : SPACING.md,
    },
    brandGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    emblemBox: {
      width: 36,
      height: 36,
      borderRadius: RADIUS.md,
      backgroundColor: 'rgba(245, 158, 11, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.35)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    emblemImage: {
      width: 30,
      height: 30,
    },
    brandInfo: {
      justifyContent: 'center',
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    brandTitle: {
      fontSize: FONT.sizes.md + 2,
      fontWeight: FONT.weights.black,
      color: theme.chromeText,
      letterSpacing: 0.3,
    },
    govtBadge: {
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      paddingHorizontal: 5,
      paddingVertical: 1,
      borderRadius: RADIUS.xs,
      borderWidth: 0.5,
      borderColor: 'rgba(245, 158, 11, 0.4)',
    },
    govtBadgeText: {
      fontSize: 8,
      fontWeight: FONT.weights.black,
      color: theme.primaryLight,
      letterSpacing: 0.5,
    },
    brandSubtitle: {
      fontSize: FONT.sizes.xxs,
      color: theme.chromeTextMuted,
      marginTop: 1,
      fontWeight: FONT.weights.medium,
    },
    actionsCluster: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    networkCapsule: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4.5,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      gap: 5,
    },
    networkText: {
      fontSize: FONT.sizes.xxs,
      fontWeight: FONT.weights.bold,
      letterSpacing: 0.2,
    },
    bellButton: {
      position: 'relative',
      width: 34,
      height: 34,
      borderRadius: RADIUS.pill,
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bellBadge: {
      position: 'absolute',
      top: -3,
      right: -3,
      backgroundColor: theme.primary,
      width: 16,
      height: 16,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: theme.chromeBackground,
    },
    bellBadgeText: {
      fontSize: 8.5,
      fontWeight: FONT.weights.black,
      color: '#FFFFFF',
    },
    settingsButton: {
      width: 34,
      height: 34,
      borderRadius: RADIUS.pill,
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
