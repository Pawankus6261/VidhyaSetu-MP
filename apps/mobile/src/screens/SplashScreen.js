// VidyaSetu MP — Premium Splash / Onboarding Screen
// Faithfully matches Stitch Dark Screen: projects/13816351680170292712/screens/532968bc08ef4d9e9e6774f4256cabc7
// Features: Official Knowledge Torch Logo, 0 kbps Telemetry, 3-Stat System Card, Dialect Selector,
// Auto-dismiss countdown timer (3s) so the screen never gets stuck, plus instant Skip button
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { RADIUS, FONT } from '../constants/theme';

export default function SplashScreen({ onStart }) {
  const { theme, dialect, setDialect, DIALECTS, networkState, isEnglish } = useApp();
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const isSmallScreen = height < 700;

  // Auto-dismiss timer so user never gets stuck on reload!
  const [countdown, setCountdown] = useState(3);
  useEffect(() => {
    if (countdown <= 0) {
      if (onStart) onStart();
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, onStart]);

  const s = makeStyles(theme, width, height, isTablet, isSmallScreen);

  return (
    <View style={s.container}>
      {/* Top Countdown Progress Indicator */}
      <View style={s.autoProgressLine}>
        <View style={[s.autoProgressFill, { width: `${((4 - countdown) / 3) * 100}%` }]} />
      </View>

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.adaptiveShell}>
          {/* TOP BAR: Telemetry & Instant Skip */}
          <View style={s.topStatusBar}>
            <View style={s.networkGroup}>
              <View style={s.pulseDotWrapper}>
                <View
                  style={[
                    s.pulseDotRing,
                    { backgroundColor: networkState.isOnline ? '#10B981' : '#F59E0B' },
                  ]}
                />
                <View
                  style={[
                    s.pulseDotCore,
                    { backgroundColor: networkState.isOnline ? '#10B981' : '#F59E0B' },
                  ]}
                />
              </View>
              <Text style={s.statusText}>
                {networkState.isOnline
                  ? (isEnglish ? 'Online Mode' : 'ऑनलाइन सक्रिय')
                  : (isEnglish ? 'Offline Active • Ready' : 'ऑफलाइन सक्रिय • Ready')}
              </Text>
            </View>

            {/* Instant Skip Button */}
            <TouchableOpacity
              style={s.skipButton}
              onPress={onStart}
              activeOpacity={0.7}
            >
              <Text style={s.skipButtonText}>
                {isEnglish ? `Enter App (${countdown}s) ➔` : `सीधे ऐप देखें (${countdown}s) ➔`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* BRAND HERO SECTION WITH OFFICIAL LOGO */}
          <View style={s.brandHero}>
            {/* Official Knowledge Torch Emblem Asset */}
            <View style={s.emblemWrapper}>
              <View style={s.emblemGlowAura} />
              <Image
                source={require('../../assets/adaptive-icon.png')}
                style={s.torchLogoImage}
                resizeMode="contain"
              />
            </View>

            {/* Brand Titles */}
            <Text style={s.brandTitleHindi}>विद्यासेतु</Text>
            <Text style={s.brandTitleEnglish}>VIDYASETU MP</Text>
            <Text style={s.brandTagline}>
              {isEnglish
                ? 'Digital Inclusion • Higher Education OS'
                : 'डिजिटल समावेशन • उच्च शिक्षा ऑपरेटिंग सिस्टम'}
            </Text>

            {/* 3 Feature Pills */}
            <View style={s.featurePillsRow}>
              <View style={s.featurePill}>
                <Text style={s.featurePillText}>✈ {isEnglish ? '100% Offline' : '100% ऑफलाइन'}</Text>
              </View>
              <View style={s.featurePill}>
                <Text style={s.featurePillText}>🎙 {isEnglish ? '6 Languages' : '5 बोलियाँ + EN'}</Text>
              </View>
              <View style={s.featurePill}>
                <Text style={s.featurePillText}>💰 {isEnglish ? '48 Schemes' : '48 योजनाएं'}</Text>
              </View>
            </View>
          </View>

          {/* 3-COLUMN CORE METRICS CARD */}
          <View style={s.statsCard}>
            <View style={s.statCol}>
              <Text style={s.statNum}>1.8 MB</Text>
              <Text style={s.statLabel}>{isEnglish ? 'Per Lecture' : 'प्रति व्याख्यान'}</Text>
              <View style={s.statTagGreen}>
                <Text style={s.statTagGreenText}>
                  {isEnglish ? 'Ultra-Compressed' : 'अल्ट्रा-कंप्रेस्ड'}
                </Text>
              </View>
            </View>

            <View style={s.statDivider} />

            <View style={s.statCol}>
              <Text style={[s.statNum, { color: theme.primaryLight }]}>0 kbps</Text>
              <Text style={s.statLabel}>{isEnglish ? 'Zero Bandwidth' : 'न्यूनतम बैंडविड्थ'}</Text>
              <View style={s.statTagAmber}>
                <Text style={s.statTagAmberText}>{isEnglish ? 'Zero Data' : 'शून्य डेटा'}</Text>
              </View>
            </View>

            <View style={s.statDivider} />

            <View style={s.statCol}>
              <Text style={[s.statNum, { color: '#38BDF8' }]}>48+</Text>
              <Text style={s.statLabel}>{isEnglish ? 'Scholarships' : 'छात्रवृत्ति योजनाएं'}</Text>
              <View style={s.statTagSky}>
                <Text style={s.statTagSkyText}>{isEnglish ? 'Offline Engine' : 'पात्रता इंजन'}</Text>
              </View>
            </View>
          </View>

          {/* PRIMARY LAUNCH CTA BUTTON */}
          <TouchableOpacity
            style={s.launchButton}
            onPress={onStart}
            activeOpacity={0.85}
          >
            <Text style={s.launchButtonText}>
              {isEnglish ? 'Launch VidyaSetu ▶' : 'पाठशाला शुरू करें ▶'}
            </Text>
          </TouchableOpacity>

          {/* REGIONAL DIALECT PICKER */}
          <View style={s.dialectSection}>
            <View style={s.dialectSectionHeader}>
              <Text style={s.dialectPickerLabel}>
                {isEnglish ? 'Choose Language / Dialect:' : 'अपनी क्षेत्रीय बोली चुनें (Select Dialect):'}
              </Text>
              <Text style={s.bilingualBadge}>Bilingual Audio</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.dialectScrollContainer}
            >
              {DIALECTS.map((d) => {
                const isSelected = dialect === d.code;
                return (
                  <TouchableOpacity
                    key={d.code}
                    style={[s.dialectPill, isSelected && s.dialectPillActive]}
                    onPress={() => setDialect(d.code)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.dialectPillText, isSelected && s.dialectPillTextActive]}>
                      {isSelected ? `✓ ${d.label}` : d.label}
                    </Text>
                    <Text style={[s.dialectSubLabel, isSelected && s.dialectSubLabelActive]}>
                      {d.sub}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* FOOTER GUARANTEE */}
          <View style={s.footerContainer}>
            <Text style={s.affiliationText}>
              {isEnglish
                ? 'Government of Madhya Pradesh • Barkatullah University Affiliated'
                : 'मध्य प्रदेश शासन • बरकतउल्ला विश्वविद्यालय संबद्ध'}
            </Text>
            <View style={s.guaranteePill}>
              <Text style={s.guaranteeText}>
                ✈ {isEnglish ? 'Offline Mode' : 'ऑफलाइन मोड'} • 0 kbps • {isEnglish ? 'All Content Ready' : 'सभी सामग्री सुरक्षित'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const makeStyles = (theme, width, height, isTablet, isSmallScreen) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0A192F', // Signature Midnight Stitch Slate
    },
    autoProgressLine: {
      height: 3,
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    autoProgressFill: {
      height: '100%',
      backgroundColor: theme.primaryLight,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: isTablet ? 32 : 16,
      paddingVertical: 14,
    },
    adaptiveShell: {
      width: '100%',
      maxWidth: isTablet ? 560 : 440,
    },

    // Status Bar
    topStatusBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.08)',
      marginBottom: 10,
    },
    networkGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    pulseDotWrapper: {
      width: 10,
      height: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pulseDotRing: {
      position: 'absolute',
      width: 12,
      height: 12,
      borderRadius: 6,
      opacity: 0.35,
    },
    pulseDotCore: {
      width: 7,
      height: 7,
      borderRadius: 4,
    },
    statusText: {
      fontSize: 11,
      fontWeight: FONT.weights.semibold,
      color: '#CBD5E1',
    },
    skipButton: {
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.4)',
    },
    skipButtonText: {
      fontSize: 10.5,
      fontWeight: FONT.weights.bold,
      color: theme.primaryLight,
    },

    // Brand Hero Section
    brandHero: {
      alignItems: 'center',
      marginVertical: isSmallScreen ? 6 : 12,
    },
    emblemWrapper: {
      position: 'relative',
      width: isTablet ? 140 : 116,
      height: isTablet ? 140 : 116,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    emblemGlowAura: {
      position: 'absolute',
      width: isTablet ? 160 : 136,
      height: isTablet ? 160 : 136,
      borderRadius: 80,
      backgroundColor: 'rgba(245, 158, 11, 0.22)',
    },
    torchLogoImage: {
      width: isTablet ? 130 : 108,
      height: isTablet ? 130 : 108,
    },
    brandTitleHindi: {
      fontSize: isTablet ? 34 : 28,
      fontWeight: FONT.weights.extrabold,
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    brandTitleEnglish: {
      fontSize: isTablet ? 13 : 11,
      fontWeight: FONT.weights.extrabold,
      color: theme.primaryLight,
      letterSpacing: 2.5,
      marginTop: 1,
    },
    brandTagline: {
      fontSize: isTablet ? 12.5 : 11,
      color: '#94A3B8',
      fontWeight: FONT.weights.medium,
      textAlign: 'center',
      marginTop: 3,
      marginBottom: 10,
    },
    featurePillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 6,
    },
    featurePill: {
      backgroundColor: 'rgba(255, 255, 255, 0.07)',
      paddingHorizontal: 10,
      paddingVertical: 3.5,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.3)',
    },
    featurePillText: {
      fontSize: 10,
      fontWeight: FONT.weights.semibold,
      color: '#FDE68A',
    },

    // Stats Card (3-Column)
    statsCard: {
      flexDirection: 'row',
      backgroundColor: '#131C31',
      borderRadius: RADIUS.lg,
      padding: isTablet ? 16 : 12,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      marginBottom: 12,
    },
    statCol: {
      flex: 1,
      alignItems: 'center',
    },
    statDivider: {
      width: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      marginHorizontal: 4,
    },
    statNum: {
      fontSize: isTablet ? 20 : 17,
      fontWeight: FONT.weights.extrabold,
      color: '#FFFFFF',
    },
    statLabel: {
      fontSize: 9.5,
      color: '#94A3B8',
      marginTop: 2,
      marginBottom: 3,
    },
    statTagGreen: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      paddingHorizontal: 5,
      paddingVertical: 1.5,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: '#10B981',
    },
    statTagGreenText: {
      fontSize: 8,
      fontWeight: FONT.weights.bold,
      color: '#34D399',
    },
    statTagAmber: {
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      paddingHorizontal: 5,
      paddingVertical: 1.5,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: theme.primary,
    },
    statTagAmberText: {
      fontSize: 8,
      fontWeight: FONT.weights.bold,
      color: '#FBBF24',
    },
    statTagSky: {
      backgroundColor: 'rgba(56, 189, 248, 0.15)',
      paddingHorizontal: 5,
      paddingVertical: 1.5,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: '#38BDF8',
    },
    statTagSkyText: {
      fontSize: 8,
      fontWeight: FONT.weights.bold,
      color: '#38BDF8',
    },

    // Launch Button
    launchButton: {
      backgroundColor: theme.primary,
      borderRadius: RADIUS.md,
      paddingVertical: isTablet ? 15 : 13,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.45,
      shadowRadius: 10,
      marginBottom: 12,
    },
    launchButtonText: {
      color: '#FFFFFF',
      fontSize: isTablet ? 16 : 14.5,
      fontWeight: FONT.weights.extrabold,
      letterSpacing: 0.3,
    },

    // Dialect Picker
    dialectSection: {
      marginBottom: 12,
    },
    dialectSectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
      paddingHorizontal: 2,
    },
    dialectPickerLabel: {
      fontSize: 10.5,
      fontWeight: FONT.weights.bold,
      color: '#CBD5E1',
    },
    bilingualBadge: {
      fontSize: 9,
      color: theme.primaryLight,
      fontWeight: FONT.weights.semibold,
    },
    dialectScrollContainer: {
      gap: 6,
      paddingBottom: 2,
    },
    dialectPill: {
      backgroundColor: '#131C31',
      paddingHorizontal: 11,
      paddingVertical: 5,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.12)',
      alignItems: 'center',
    },
    dialectPillActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primaryBright,
    },
    dialectPillText: {
      fontSize: 11,
      fontWeight: FONT.weights.bold,
      color: '#E2E8F0',
    },
    dialectPillTextActive: {
      color: '#FFFFFF',
      fontWeight: FONT.weights.extrabold,
    },
    dialectSubLabel: {
      fontSize: 8,
      color: '#94A3B8',
      marginTop: 1,
    },
    dialectSubLabelActive: {
      color: 'rgba(255, 255, 255, 0.9)',
    },

    // Footer
    footerContainer: {
      alignItems: 'center',
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.08)',
      gap: 5,
    },
    affiliationText: {
      fontSize: 9.5,
      color: '#64748B',
      textAlign: 'center',
    },
    guaranteePill: {
      backgroundColor: '#111927',
      paddingHorizontal: 9,
      paddingVertical: 3,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    guaranteeText: {
      fontSize: 9,
      color: '#CBD5E1',
    },
  });
