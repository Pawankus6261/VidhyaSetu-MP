// VidyaSetu MP — Career Screen (करियर)
// Hyperlocal MP career pathways with 3-month roadmaps, zero distress migration indicators, and full English & Hindi support
// Adaptive layout for phones, tablets, foldables, and desktop web
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { CAREER_PATHWAYS } from '../data/careers';
import { SPACING, RADIUS, FONT } from '../constants/theme';

export default function CareerScreen() {
  const { theme, t, isEnglish } = useApp();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const s = makeStyles(theme, isTablet);

  const FILTER_OPTIONS = [
    { key: 'ALL',     labelHi: 'सभी',           labelEn: 'All Tracks' },
    { key: 'BANKING', labelHi: 'बैंकिंग',        labelEn: 'Banking & BC' },
    { key: 'GOVT',    labelHi: 'सरकारी नौकरी',   labelEn: 'Govt Services' },
    { key: 'FPO',     labelHi: 'उद्यमिता व FPO', labelEn: 'Agri-Business & FPO' },
  ];

  const [activeFilterKey, setActiveFilterKey] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);

  const filteredPathways = CAREER_PATHWAYS.filter((c) => {
    if (activeFilterKey === 'ALL') return true;
    if (activeFilterKey === 'BANKING') return c.category.includes('बैंकिंग') || c.pathway_id.includes('BANK');
    if (activeFilterKey === 'GOVT') return c.category.includes('सरकारी') || c.pathway_id.includes('FOREST');
    if (activeFilterKey === 'FPO') return c.category.includes('उद्यम') || c.category.includes('FPO');
    return true;
  });

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.adaptiveWrapper}>
        {/* BANNER WITH STAT COUNTERS */}
        <View style={s.banner}>
          <Text style={s.bannerTag}>
            {isEnglish ? 'HYPERLOCAL MP OPPORTUNITIES' : 'स्थानीय मध्य प्रदेश रोजगार'}
          </Text>
          <Text style={s.bannerTitle}>{t.career.title}</Text>
          <Text style={s.bannerSubtitle}>{t.career.subtitle}</Text>

          <View style={s.bannerStats}>
            <View style={s.bannerStat}>
              <Text style={s.bannerStatNum}>{CAREER_PATHWAYS.length}</Text>
              <Text style={s.bannerStatLabel}>{t.career.pathways}</Text>
            </View>
            <View style={s.bannerStat}>
              <Text style={[s.bannerStatNum, { color: theme.primaryLight }]}>
                {isEnglish ? '3-6 Mos' : '3-6 माह'}
              </Text>
              <Text style={s.bannerStatLabel}>{t.career.roadmap}</Text>
            </View>
            <View style={s.bannerStat}>
              <Text style={[s.bannerStatNum, { color: '#34D399' }]}>0%</Text>
              <Text style={s.bannerStatLabel}>{t.career.zeroMigration}</Text>
            </View>
          </View>
        </View>

        {/* FILTER PILLS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.filterScroll}
          contentContainerStyle={s.filterScrollContent}
        >
          {FILTER_OPTIONS.map((f) => {
            const isActive = activeFilterKey === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[s.filterPill, isActive && s.filterPillActive]}
                onPress={() => setActiveFilterKey(f.key)}
                activeOpacity={0.75}
              >
                <Text style={[s.filterPillText, isActive && s.filterPillTextActive]}>
                  {isEnglish ? f.labelEn : f.labelHi}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* CAREER PATHWAY CARDS */}
        {filteredPathways.map((item) => {
          const isExp = expandedId === item.pathway_id;
          return (
            <View key={item.pathway_id} style={s.card}>
              <View style={s.cardTopRow}>
                <View style={s.categoryBadge}>
                  <Text style={s.categoryBadgeText}>{item.category}</Text>
                </View>
                <View style={s.zeroMigBadge}>
                  <Text style={s.zeroMigText}>📍 {item.badge || item.geographic_fit}</Text>
                </View>
              </View>

              <Text style={s.cardTitle}>{item.title_hindi}</Text>
              <Text style={s.cardDesc}>{item.overview_hindi}</Text>

              {/* Income & Location */}
              <View style={s.pillInfoRow}>
                <View style={s.incomePill}>
                  <Text style={s.incomePillLabel}>{t.career.monthlyIncome}:</Text>
                  <Text style={s.incomePillVal}>{item.immediate_earning_potential_inr}</Text>
                </View>
                <View style={s.timePill}>
                  <Text style={s.timePillText}>⏱️ {item.time_to_earning}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={s.roadmapToggleBtn}
                onPress={() => setExpandedId(isExp ? null : item.pathway_id)}
                activeOpacity={0.8}
              >
                <Text style={s.roadmapToggleText}>
                  {isExp
                    ? (isEnglish ? '▲ Collapse Roadmap' : '▲ तैयारी रोडमैप छुपाएं')
                    : (isEnglish ? '▼ View Preparation Roadmap & Details' : '▼ तैयारी रोडमैप एवं पात्रता देखें')}
                </Text>
              </TouchableOpacity>

              {isExp && (
                <View style={s.roadmapContainer}>
                  {/* Key Qualifications */}
                  <Text style={s.roadmapHeading}>
                    🎓 {isEnglish ? 'Key Qualifications:' : 'अनिवार्य योग्यता एवं पात्रता:'}
                  </Text>
                  <View style={s.qualBox}>
                    {item.key_qualifications.map((q, qi) => (
                      <Text key={`qual_${item.pathway_id}_${qi}`} style={s.qualItem}>
                        ✓ {q}
                      </Text>
                    ))}
                  </View>

                  {/* Step-by-Step Preparation Roadmap */}
                  <Text style={[s.roadmapHeading, { marginTop: 10 }]}>
                    📅 {isEnglish ? 'Preparation Roadmap:' : 'चरणबद्ध तैयारी रोडमैप:'}
                  </Text>
                  {item.preparation_roadmap.map((step, si) => (
                    <View key={`step_${item.pathway_id}_${si}`} style={s.milestoneItem}>
                      <View style={s.milestoneStepNode}>
                        <Text style={s.milestoneMonthText}>{si + 1}</Text>
                      </View>
                      <View style={s.milestoneContent}>
                        <Text style={s.milestoneStepText}>{step}</Text>
                      </View>
                    </View>
                  ))}

                  {/* Geographic Fit */}
                  <View style={s.contactsBox}>
                    <Text style={s.contactsTitle}>
                      📍 {isEnglish ? 'Geographic Fit & Local Deployment:' : 'कार्यक्षेत्र एवं स्थानीय पदस्थापना:'}
                    </Text>
                    <Text style={s.contactsBody}>{item.geographic_fit}</Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const makeStyles = (theme, isTablet) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: SPACING.md,
      paddingBottom: 90,
      alignItems: 'center',
    },
    adaptiveWrapper: {
      width: '100%',
      maxWidth: isTablet ? 760 : '100%',
    },

    // Banner
    banner: {
      backgroundColor: theme.chromeBackground,
      borderRadius: RADIUS.lg,
      padding: isTablet ? SPACING.lg : SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    bannerTag: {
      fontSize: 10,
      fontWeight: FONT.weights.extrabold,
      color: theme.primaryLight,
      letterSpacing: 0.5,
      marginBottom: 3,
    },
    bannerTitle: {
      fontSize: isTablet ? FONT.sizes.xl : FONT.sizes.lg,
      fontWeight: FONT.weights.extrabold,
      color: '#F8FAFC',
    },
    bannerSubtitle: {
      fontSize: 11,
      color: '#94A3B8',
      marginTop: 2,
      lineHeight: 16,
    },
    bannerStats: {
      flexDirection: 'row',
      marginTop: SPACING.md,
      paddingTop: SPACING.sm,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.08)',
      justifyContent: 'space-around',
    },
    bannerStat: {
      alignItems: 'center',
    },
    bannerStatNum: {
      fontSize: isTablet ? 24 : 20,
      fontWeight: FONT.weights.extrabold,
      color: '#F8FAFC',
    },
    bannerStatLabel: {
      fontSize: 10,
      color: '#94A3B8',
      marginTop: 1,
    },

    // Filters
    filterScroll: {
      marginBottom: SPACING.md,
      width: '100%',
    },
    filterScrollContent: {
      gap: 6,
    },
    filterPill: {
      paddingHorizontal: 13,
      paddingVertical: 6,
      borderRadius: RADIUS.pill,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    filterPillActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primaryLight,
    },
    filterPillText: {
      fontSize: 11,
      fontWeight: FONT.weights.bold,
      color: theme.textSecondary,
    },
    filterPillTextActive: {
      color: '#FFFFFF',
    },

    // Cards
    card: {
      backgroundColor: theme.surface,
      borderRadius: RADIUS.lg,
      padding: isTablet ? SPACING.lg : SPACING.md,
      marginBottom: SPACING.sm + 4,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      elevation: 2,
    },
    cardTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    categoryBadge: {
      backgroundColor: theme.primarySoft,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
    },
    categoryBadgeText: {
      fontSize: 10,
      fontWeight: FONT.weights.extrabold,
      color: theme.primary,
    },
    zeroMigBadge: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: RADIUS.pill,
    },
    zeroMigText: {
      fontSize: 9.5,
      fontWeight: FONT.weights.bold,
      color: '#059669',
    },
    cardTitle: {
      fontSize: FONT.sizes.base,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
      lineHeight: 21,
    },
    cardDesc: {
      fontSize: 11.5,
      color: theme.textSecondary,
      lineHeight: 17,
      marginTop: 4,
      marginBottom: 8,
    },
    pillInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 10,
    },
    incomePill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceAlt,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.surfaceBorderAlt,
      gap: 4,
    },
    incomePillLabel: {
      fontSize: 10,
      color: theme.textMuted,
      fontWeight: FONT.weights.semibold,
    },
    incomePillVal: {
      fontSize: 11,
      fontWeight: FONT.weights.extrabold,
      color: theme.primary,
    },
    timePill: {
      backgroundColor: theme.surfaceAlt,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.surfaceBorderAlt,
    },
    timePillText: {
      fontSize: 10.5,
      color: theme.textSecondary,
      fontWeight: FONT.weights.semibold,
    },
    roadmapToggleBtn: {
      paddingVertical: 6,
      borderTopWidth: 1,
      borderTopColor: theme.surfaceBorder,
      alignItems: 'center',
    },
    roadmapToggleText: {
      fontSize: 11,
      fontWeight: FONT.weights.bold,
      color: theme.primary,
    },
    roadmapContainer: {
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.surfaceBorder,
    },
    roadmapHeading: {
      fontSize: 11.5,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
      marginBottom: 6,
    },
    qualBox: {
      backgroundColor: theme.surfaceAlt,
      padding: 8,
      borderRadius: 6,
      gap: 3,
      marginBottom: 6,
    },
    qualItem: {
      fontSize: 10.5,
      color: theme.textSecondary,
      lineHeight: 16,
    },
    milestoneItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
      gap: 8,
    },
    milestoneStepNode: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.primarySoft,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
      justifyContent: 'center',
      alignItems: 'center',
    },
    milestoneMonthText: {
      fontSize: 10,
      fontWeight: FONT.weights.extrabold,
      color: theme.primary,
    },
    milestoneContent: {
      flex: 1,
    },
    milestoneStepText: {
      fontSize: 11,
      color: theme.textSecondary,
      lineHeight: 16,
    },
    contactsBox: {
      marginTop: 8,
      backgroundColor: theme.surfaceAlt,
      padding: 8,
      borderRadius: 6,
      borderLeftWidth: 3,
      borderLeftColor: theme.primary,
    },
    contactsTitle: {
      fontSize: 10.5,
      fontWeight: FONT.weights.bold,
      color: theme.textPrimary,
    },
    contactsBody: {
      fontSize: 10,
      color: theme.textSecondary,
      marginTop: 2,
    },
  });
