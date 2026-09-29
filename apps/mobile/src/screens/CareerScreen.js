// VidyaSetu MP — Career Screen (करियर)
// Hyperlocal MP career pathways with 3-month roadmaps, zero distress migration indicators, and full English & Hindi support
// Real Vector Icons via @expo/vector-icons, Optimistic UI Navigation, Zero Emojis
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CAREER_PATHWAYS } from '../data/careers';
import { SPACING, RADIUS, FONT } from '../constants/theme';
import { careerApi } from '../api/index.js';

export default function CareerScreen() {
  const { theme, t, isEnglish, networkState, studentProfile } = useApp();
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
  const [cloudRecommendation, setCloudRecommendation] = useState(null);

  useEffect(() => {
    const fetchRec = async () => {
      if (!networkState.isOnline) return;
      try {
        const res = await careerApi.getRecommendation({
          enrolledDegree: studentProfile?.course_enrolled || 'BA',
          district: studentProfile?.district || 'Barwani',
          familyLandHoldingAcres: 2.0,
        });
        if (res.isSuccess && res.data) {
          setCloudRecommendation(res.data);
        }
      } catch (e) {
        // Safe offline fallback
      }
    };
    fetchRec();
  }, [networkState.isOnline]);

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
          <View style={s.bannerTop}>
            <View style={s.bannerTagPill}>
              <Ionicons name="compass-outline" size={13} color={theme.primaryLight} />
              <Text style={s.bannerTagText}>
                {isEnglish ? 'HYPERLOCAL MP OPPORTUNITIES' : 'स्थानीय मध्य प्रदेश रोजगार'}
              </Text>
            </View>
          </View>
          <Text style={s.bannerTitle}>{t.career.title}</Text>
          <Text style={s.bannerSubtitle}>{t.career.subtitle}</Text>

          <View style={s.bannerStats}>
            <View style={s.bannerStat}>
              <Text style={s.bannerStatNum}>{CAREER_PATHWAYS.length}</Text>
              <Text style={s.bannerStatLabel}>{t.career.pathways}</Text>
            </View>
            <View style={s.bannerStatDivider} />
            <View style={s.bannerStat}>
              <Text style={[s.bannerStatNum, { color: theme.primaryLight }]}>
                {isEnglish ? '3-6 Mos' : '3-6 माह'}
              </Text>
              <Text style={s.bannerStatLabel}>{t.career.roadmap}</Text>
            </View>
            <View style={s.bannerStatDivider} />
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

        {/* HYPERLOCAL DISTRICT RECOMMENDATION HERO */}
        {cloudRecommendation && (
          <View style={[s.banner, { backgroundColor: 'rgba(56, 189, 248, 0.08)', borderColor: 'rgba(56, 189, 248, 0.3)', marginBottom: SPACING.md }]}>
            <View style={s.bannerTop}>
              <View style={[s.bannerTagPill, { backgroundColor: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.35)' }]}>
                <Ionicons name="sparkles" size={12} color="#38BDF8" />
                <Text style={[s.bannerTagText, { color: '#38BDF8' }]}>
                  {isEnglish
                    ? `RECOMMENDED FOR ${cloudRecommendation.district.toUpperCase()}`
                    : `${cloudRecommendation.district} जिला संस्तुति`}
                </Text>
              </View>
            </View>
            <Text style={[s.bannerTitle, { fontSize: 16, marginTop: 4 }]}>
              {cloudRecommendation.primary_recommendation?.title}
            </Text>
            <Text style={[s.bannerSubtitle, { marginBottom: 6 }]}>
              {cloudRecommendation.primary_recommendation?.description}
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 4 }}>
              <Text style={{ fontSize: 12, color: '#34D399', fontWeight: '700' }}>
                {cloudRecommendation.primary_recommendation?.monthly_earning_estimate}
              </Text>
              <Text style={{ fontSize: 11, color: theme.textMuted }}>
                {isEnglish ? 'Zero Distress Migration' : 'शून्य संकट पलायन'}
              </Text>
            </View>
          </View>
        )}

        {/* CAREER PATHWAY CARDS */}
        {(filteredPathways || []).map((item) => {
          const isExp = expandedId === item.pathway_id;
          return (
            <View key={item.pathway_id} style={s.card}>
              <View style={s.cardTopRow}>
                <View style={s.categoryBadge}>
                  <Text style={s.categoryBadgeText}>{item.category}</Text>
                </View>
                <View style={s.zeroMigBadge}>
                  <Ionicons name="location-outline" size={11} color="#34D399" />
                  <Text style={s.zeroMigText}>{item.badge || item.geographic_fit}</Text>
                </View>
              </View>

              <Text style={s.cardTitle}>{item.title_hindi}</Text>
              <Text style={s.cardDesc}>{item.overview_hindi}</Text>

              {/* Income & Duration Pills */}
              <View style={s.pillInfoRow}>
                <View style={s.incomePill}>
                  <Text style={s.incomePillLabel}>{t.career.monthlyIncome}:</Text>
                  <Text style={s.incomePillVal}>{item.immediate_earning_potential_inr}</Text>
                </View>
                <View style={s.timePill}>
                  <Ionicons name="time-outline" size={12} color={theme.textSecondary} />
                  <Text style={s.timePillText}>{item.time_to_earning}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={s.roadmapToggleBtn}
                onPress={() => setExpandedId(isExp ? null : item.pathway_id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isExp ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color={theme.primaryLight}
                />
                <Text style={s.roadmapToggleText}>
                  {isExp
                    ? (isEnglish ? 'Collapse Roadmap' : 'तैयारी रोडमैप छुपाएं')
                    : (isEnglish ? 'View Preparation Roadmap & Details' : 'तैयारी रोडमैप एवं पात्रता देखें')}
                </Text>
              </TouchableOpacity>

              {isExp && (
                <View style={s.roadmapContainer}>
                  {/* Key Qualifications */}
                  <View style={s.roadmapHeaderRow}>
                    <Ionicons name="school-outline" size={14} color={theme.primaryLight} />
                    <Text style={s.roadmapHeading}>
                      {isEnglish ? 'Key Qualifications:' : 'अनिवार्य योग्यता एवं पात्रता:'}
                    </Text>
                  </View>
                  <View style={s.qualBox}>
                    {(item.key_qualifications || []).map((q, qi) => (
                      <View key={`qual_${item.pathway_id}_${qi}`} style={s.qualItemRow}>
                        <Ionicons name="checkmark-circle-outline" size={13} color={theme.success} />
                        <Text style={s.qualItem}>{q}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Step-by-Step Preparation Roadmap */}
                  <View style={[s.roadmapHeaderRow, { marginTop: 10 }]}>
                    <Ionicons name="calendar-outline" size={14} color={theme.primaryLight} />
                    <Text style={s.roadmapHeading}>
                      {isEnglish ? 'Preparation Roadmap:' : 'चरणबद्ध तैयारी रोडमैप:'}
                    </Text>
                  </View>
                  {(item.preparation_roadmap || []).map((step, si) => (
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
                    <View style={s.contactsTitleRow}>
                      <Ionicons name="map-outline" size={13} color={theme.primaryLight} />
                      <Text style={s.contactsTitle}>
                        {isEnglish ? 'Geographic Fit & Local Deployment:' : 'कार्यक्षेत्र एवं स्थानीय पदस्थापना:'}
                      </Text>
                    </View>
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
      paddingBottom: 95,
      alignItems: 'center',
    },
    adaptiveWrapper: {
      width: '100%',
      maxWidth: isTablet ? 760 : '100%',
    },

    // Banner
    banner: {
      backgroundColor: theme.surface,
      borderRadius: RADIUS.xl,
      padding: isTablet ? SPACING.lg : SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      elevation: 4,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 10,
    },
    bannerTop: {
      marginBottom: 8,
    },
    bannerTagPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(245, 158, 11, 0.12)',
      paddingHorizontal: 8,
      paddingVertical: 3.5,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.35)',
      alignSelf: 'flex-start',
      gap: 5,
    },
    bannerTagText: {
      fontSize: 9.5,
      fontWeight: FONT.weights.black,
      color: theme.primaryLight,
      letterSpacing: 0.4,
    },
    bannerTitle: {
      fontSize: isTablet ? FONT.sizes.xl : FONT.sizes.lg,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
    },
    bannerSubtitle: {
      fontSize: 11,
      color: theme.textMuted,
      marginTop: 3,
      lineHeight: 16,
    },
    bannerStats: {
      flexDirection: 'row',
      marginTop: SPACING.md,
      paddingTop: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: theme.surfaceBorder,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    bannerStat: {
      alignItems: 'center',
      flex: 1,
    },
    bannerStatDivider: {
      width: 1,
      height: 24,
      backgroundColor: theme.surfaceBorder,
    },
    bannerStatNum: {
      fontSize: isTablet ? 24 : 20,
      fontWeight: FONT.weights.black,
      color: theme.textPrimary,
    },
    bannerStatLabel: {
      fontSize: 9.5,
      color: theme.textMuted,
      marginTop: 2,
      fontWeight: FONT.weights.semibold,
    },

    // Filters
    filterScroll: {
      marginBottom: SPACING.md,
      width: '100%',
    },
    filterScrollContent: {
      gap: 6,
      paddingVertical: 1,
    },
    filterPill: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: RADIUS.pill,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    filterPillActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primaryBright,
    },
    filterPillText: {
      fontSize: 11,
      fontWeight: FONT.weights.semibold,
      color: theme.textSecondary,
    },
    filterPillTextActive: {
      color: '#FFFFFF',
      fontWeight: FONT.weights.extrabold,
    },

    // Cards
    card: {
      backgroundColor: theme.surface,
      borderRadius: RADIUS.xl,
      padding: isTablet ? SPACING.lg : SPACING.md,
      marginBottom: SPACING.sm + 4,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      elevation: 3,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 8,
    },
    cardTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryBadge: {
      backgroundColor: theme.primarySoft,
      paddingHorizontal: 8,
      paddingVertical: 3.5,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
    },
    categoryBadgeText: {
      fontSize: 9.5,
      fontWeight: FONT.weights.extrabold,
      color: theme.primaryLight,
    },
    zeroMigBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      paddingHorizontal: 8,
      paddingVertical: 3.5,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.35)',
      gap: 4,
    },
    zeroMigText: {
      fontSize: 9.5,
      fontWeight: FONT.weights.bold,
      color: '#34D399',
    },
    cardTitle: {
      fontSize: FONT.sizes.base,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
      lineHeight: 22,
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
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      paddingHorizontal: 10,
      paddingVertical: 4.5,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.25)',
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
      color: theme.primaryLight,
    },
    timePill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceAlt,
      paddingHorizontal: 9,
      paddingVertical: 4.5,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      gap: 5,
    },
    timePillText: {
      fontSize: 10,
      color: theme.textSecondary,
      fontWeight: FONT.weights.semibold,
    },
    roadmapToggleBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      borderTopWidth: 1,
      borderTopColor: theme.surfaceBorder,
      gap: 5,
    },
    roadmapToggleText: {
      fontSize: 11,
      fontWeight: FONT.weights.bold,
      color: theme.primaryLight,
    },
    roadmapContainer: {
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.surfaceBorder,
    },
    roadmapHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 6,
    },
    roadmapHeading: {
      fontSize: 11,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
    },
    qualBox: {
      backgroundColor: theme.surfaceAlt,
      padding: 10,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      gap: 5,
      marginBottom: 6,
    },
    qualItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    qualItem: {
      fontSize: 10.5,
      color: theme.textSecondary,
      lineHeight: 16,
      flex: 1,
    },
    milestoneItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
      gap: 8,
    },
    milestoneStepNode: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.primarySoft,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
      justifyContent: 'center',
      alignItems: 'center',
    },
    milestoneMonthText: {
      fontSize: 9.5,
      fontWeight: FONT.weights.extrabold,
      color: theme.primaryLight,
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
      padding: 10,
      borderRadius: RADIUS.md,
      borderLeftWidth: 3,
      borderLeftColor: theme.primaryLight,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    contactsTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 3,
    },
    contactsTitle: {
      fontSize: 10.5,
      fontWeight: FONT.weights.bold,
      color: theme.textPrimary,
    },
    contactsBody: {
      fontSize: 10,
      color: theme.textSecondary,
      lineHeight: 15,
    },
  });
