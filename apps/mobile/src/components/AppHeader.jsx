// VidyaSetu MP — Premium Global Header Component
// Features: Official Knowledge Torch Logo, Civic Brand Emblem, Live Network Status Pill with Pulse Glow, 6-Language Picker, Adaptive Scaling
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { useApp } from '../context/AppContext';
import { SPACING, RADIUS, FONT } from '../constants/theme';

export default function AppHeader({ onOpenSplash }) {
  const { theme, networkState, dialect, setDialect, DIALECTS, t, isEnglish } = useApp();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const s = makeStyles(theme, isTablet);

  return (
    <View style={s.headerContainer}>
      {/* Top Brand & Network Row */}
      <View style={s.topRow}>
        <TouchableOpacity
          style={s.brandGroup}
          onPress={onOpenSplash}
          activeOpacity={0.8}
        >
          <View style={s.emblemBox}>
            <Image
              source={require('../../assets/adaptive-icon.png')}
              style={s.emblemImage}
              resizeMode="contain"
            />
          </View>
          <View>
            <View style={s.titleRow}>
              <Text style={s.brandTitle}>{t.appTitle}</Text>
              <View style={s.govtBadge}>
                <Text style={s.govtBadgeText}>MP GOVT • HE-OS</Text>
              </View>
            </View>
            <Text style={s.brandSubtitle}>{t.tagline}</Text>
          </View>
        </TouchableOpacity>

        {/* Live Network Capsule */}
        <View
          style={[
            s.networkCapsule,
            {
              borderColor: networkState.isOnline
                ? 'rgba(16, 185, 129, 0.45)'
                : 'rgba(245, 158, 11, 0.4)',
              backgroundColor: networkState.isOnline
                ? 'rgba(16, 185, 129, 0.12)'
                : 'rgba(245, 158, 11, 0.1)',
            },
          ]}
        >
          <View
            style={[
              s.networkDot,
              {
                backgroundColor: networkState.isOnline ? theme.online : theme.offline,
                shadowColor: networkState.isOnline ? theme.online : theme.offline,
              },
            ]}
          />
          <Text
            style={[
              s.networkText,
              { color: networkState.isOnline ? '#34D399' : '#FBBF24' },
            ]}
          >
            {networkState.isOnline ? `⚡ ${networkState.speed}` : (isEnglish ? '0 kbps Offline' : '0 kbps ऑफलाइन')}
          </Text>
        </View>
      </View>

      {/* Language / Dialect Selection Strip */}
      <View style={s.dialectSection}>
        <View style={s.dialectHeaderRow}>
          <Text style={s.dialectSectionLabel}>
            {isEnglish ? 'SELECT LANGUAGE / DIALECT' : 'बोली एवं भाषा चुनें:'}
          </Text>
          <View style={s.badgeRow}>
            {onOpenSplash && (
              <TouchableOpacity
                onPress={onOpenSplash}
                style={s.splashIntroLink}
                activeOpacity={0.7}
              >
                <Text style={s.splashIntroText}>ℹ️ {isEnglish ? 'App Info' : 'परिचय'}</Text>
              </TouchableOpacity>
            )}
            <Text style={s.dialectStatusBadge}>
              {DIALECTS.find((d) => d.code === dialect)?.label} ({dialect.toUpperCase()})
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.dialectScroll}
        >
          {DIALECTS.map((d) => {
            const isActive = dialect === d.code;
            return (
              <TouchableOpacity
                key={d.code}
                style={[s.dialectCapsule, isActive && s.dialectCapsuleActive]}
                onPress={() => setDialect(d.code)}
                activeOpacity={0.8}
              >
                <View style={s.dialectTextContainer}>
                  <Text style={[s.dialectMainText, isActive && s.dialectMainTextActive]}>
                    {isActive ? `✓ ${d.label}` : d.label}
                  </Text>
                  <Text style={[s.dialectSubText, isActive && s.dialectSubTextActive]}>
                    {d.sub}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Subtle Bottom Gold Trim */}
      <View style={s.goldTrim} />
    </View>
  );
}

const makeStyles = (theme, isTablet) =>
  StyleSheet.create({
    headerContainer: {
      backgroundColor: theme.chromeBackground,
      paddingTop: SPACING.md,
      paddingBottom: 0,
      borderBottomWidth: 1,
      borderBottomColor: theme.chromeBorder,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: isTablet ? SPACING.lg : SPACING.md,
      marginBottom: SPACING.sm + 2,
    },
    brandGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    emblemBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: 'rgba(245, 158, 11, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.45)',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    emblemImage: {
      width: 36,
      height: 36,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    brandTitle: {
      fontSize: FONT.sizes.xl,
      fontWeight: FONT.weights.extrabold,
      color: theme.chromeText,
      letterSpacing: 0.4,
    },
    govtBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      paddingHorizontal: 5,
      paddingVertical: 1.5,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    govtBadgeText: {
      fontSize: 8.5,
      fontWeight: FONT.weights.bold,
      color: theme.primaryLight,
      letterSpacing: 0.3,
    },
    brandSubtitle: {
      fontSize: FONT.sizes.xs,
      color: theme.chromeTextMuted,
      marginTop: 1,
    },
    networkCapsule: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      gap: 6,
    },
    networkDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.9,
      shadowRadius: 5,
      elevation: 3,
    },
    networkText: {
      fontSize: FONT.sizes.xs,
      fontWeight: FONT.weights.bold,
      letterSpacing: 0.3,
    },
    dialectSection: {
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
      paddingVertical: 7,
      paddingHorizontal: isTablet ? SPACING.lg : SPACING.md,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    dialectHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    dialectSectionLabel: {
      fontSize: 10,
      fontWeight: FONT.weights.bold,
      color: theme.chromeTextMuted,
      letterSpacing: 0.6,
    },
    badgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    splashIntroLink: {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    splashIntroText: {
      fontSize: 9.5,
      fontWeight: FONT.weights.bold,
      color: '#CBD5E1',
    },
    dialectStatusBadge: {
      fontSize: 10,
      fontWeight: FONT.weights.bold,
      color: theme.primaryLight,
    },
    dialectScroll: {
      flexDirection: 'row',
      gap: 6,
      paddingBottom: 2,
    },
    dialectCapsule: {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      paddingHorizontal: 11,
      paddingVertical: 5,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    dialectCapsuleActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primaryBright,
      elevation: 4,
      shadowColor: theme.primaryLight,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 5,
    },
    dialectTextContainer: {
      alignItems: 'center',
    },
    dialectMainText: {
      fontSize: FONT.sizes.sm,
      fontWeight: FONT.weights.bold,
      color: '#CBD5E1',
    },
    dialectMainTextActive: {
      color: '#FFFFFF',
      fontWeight: FONT.weights.extrabold,
    },
    dialectSubText: {
      fontSize: 9,
      color: '#94A3B8',
      marginTop: 1,
    },
    dialectSubTextActive: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: FONT.weights.semibold,
    },
    goldTrim: {
      height: 2,
      backgroundColor: theme.primaryLight,
      opacity: 0.85,
    },
  });
