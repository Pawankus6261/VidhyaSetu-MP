// VidyaSetu MP — Scholarship Screen (छात्रवृत्ति)
// Features: Offline deterministic eligibility engine, profile tuner, document checklists, full English & Hindi support, Adaptive Screen Layout
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { evaluateScholarships } from '../services/ScholarshipEngine';
import { SPACING, RADIUS, FONT } from '../constants/theme';

const CATEGORY_OPTIONS = ['ST', 'SC', 'OBC', 'GEN'];
const PERCENTAGE_OPTIONS = [45, 55, 68, 75, 85, 90];

export default function ScholarshipScreen() {
  const { theme, t, isEnglish } = useApp();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const s = makeStyles(theme, isTablet);

  const [profile, setProfile] = useState({
    category: 'ST',
    gender: 'FEMALE',
    annualIncome: 120000,
    twelfthPercentage: 74,
    hasSambalCard: true,
    isRentingRoom: false,
  });

  const [results, setResults] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [incomeText, setIncomeText] = useState('120000');

  useEffect(() => {
    const r = evaluateScholarships(profile);
    setResults(r);
  }, [profile]);

  const eligibleCount = results.filter((r) => r.isEligible).length;
  const totalAmount = results
    .filter((r) => r.isEligible)
    .reduce((sum, r) => sum + (r.annualEstimatedInr || 0), 0);

  const updateIncome = (val) => {
    setIncomeText(val);
    const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) setProfile((p) => ({ ...p, annualIncome: num }));
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.adaptiveWrapper}>
        {/* FINANCIAL IMPACT HERO SUMMARY */}
        <View style={s.impactHero}>
          <View style={s.impactTop}>
            <Text style={s.impactTag}>
              {isEnglish ? 'OFFLINE DETERMINISTIC MATCH' : 'ऑफलाइन पात्रता मिलान'}
            </Text>
            <View style={s.eligibleBadge}>
              <Text style={s.eligibleBadgeText}>
                {eligibleCount}/{results.length} {isEnglish ? 'SCHEMES ELIGIBLE' : 'पात्र योजनाएं'}
              </Text>
            </View>
          </View>

          <Text style={s.impactAmount}>
            ₹{totalAmount.toLocaleString('en-IN')}{' '}
            <Text style={s.impactPeriod}>/{isEnglish ? 'year' : 'वर्ष'}</Text>
          </Text>
          <Text style={s.impactSub}>
            {isEnglish
              ? 'Total estimated government educational aid unlocked for your profile.'
              : 'मध्य प्रदेश शासन द्वारा आपके प्रोफ़ाइल हेतु स्वीकृत कुल अनुमानित सहायता।'}
          </Text>
        </View>

        {/* STUDENT PROFILE TUNER CARD */}
        <View style={s.profileCard}>
          <View style={s.profileCardHeader}>
            <Text style={s.profileCardTitle}>{t.scholarship.title}</Text>
            <Text style={s.profileCardSubtitle}>{t.scholarship.subtitle}</Text>
          </View>

          {/* Social Category */}
          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>{t.scholarship.category}:</Text>
            <View style={s.pillRow}>
              {CATEGORY_OPTIONS.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[s.pill, profile.category === cat && s.pillActive]}
                  onPress={() => setProfile((p) => ({ ...p, category: cat }))}
                  activeOpacity={0.75}
                >
                  <Text style={[s.pillText, profile.category === cat && s.pillTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Gender */}
          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>{t.scholarship.gender}:</Text>
            <View style={s.pillRow}>
              {[
                { key: 'FEMALE', label: t.scholarship.female },
                { key: 'MALE',   label: t.scholarship.male },
              ].map((g) => (
                <TouchableOpacity
                  key={g.key}
                  style={[s.pill, profile.gender === g.key && s.pillActive]}
                  onPress={() => setProfile((p) => ({ ...p, gender: g.key }))}
                  activeOpacity={0.75}
                >
                  <Text style={[s.pillText, profile.gender === g.key && s.pillTextActive]}>
                    {g.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 12th Percentage */}
          <View style={s.fieldGroup}>
            <View style={s.labelWithVal}>
              <Text style={s.fieldLabel}>{t.scholarship.twelfthMarks}:</Text>
              <Text style={s.activeValBadge}>{profile.twelfthPercentage}%</Text>
            </View>
            <View style={s.pillRow}>
              {PERCENTAGE_OPTIONS.map((pct) => (
                <TouchableOpacity
                  key={pct}
                  style={[s.pctPill, profile.twelfthPercentage === pct && s.pillActive]}
                  onPress={() => setProfile((p) => ({ ...p, twelfthPercentage: pct }))}
                  activeOpacity={0.75}
                >
                  <Text style={[s.pctPillText, profile.twelfthPercentage === pct && s.pillActive]}>
                    {pct}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Annual Income Input */}
          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>{t.scholarship.annualIncome}:</Text>
            <View style={s.incomeInputWrapper}>
              <Text style={s.currencyPrefix}>₹</Text>
              <TextInput
                style={s.incomeInput}
                keyboardType="numeric"
                value={incomeText}
                onChangeText={updateIncome}
                placeholder="120000"
                placeholderTextColor={theme.textXMuted}
              />
            </View>
          </View>

          {/* Toggles */}
          <View style={s.toggleRow}>
            <View style={s.toggleLabelGroup}>
              <Text style={s.toggleTitle}>{t.scholarship.sambalCard}</Text>
              <Text style={s.toggleDesc}>
                {isEnglish ? 'Jan-Kalyan Sambal Card registered' : 'जनकल्याण संबल योजना कार्ड पंजीकृत'}
              </Text>
            </View>
            <Switch
              value={profile.hasSambalCard}
              onValueChange={(val) => setProfile((p) => ({ ...p, hasSambalCard: val }))}
              trackColor={{ false: theme.surfaceBorder, true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={s.toggleRow}>
            <View style={s.toggleLabelGroup}>
              <Text style={s.toggleTitle}>{t.scholarship.rentingRoom}</Text>
              <Text style={s.toggleDesc}>
                {isEnglish ? 'Living in rented room outside home village' : 'गाँव से दूर किराये का कमरा लेकर अध्ययन'}
              </Text>
            </View>
            <Switch
              value={profile.isRentingRoom}
              onValueChange={(val) => setProfile((p) => ({ ...p, isRentingRoom: val }))}
              trackColor={{ false: theme.surfaceBorder, true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* RESULTS LIST */}
        <View style={s.resultsHeader}>
          <Text style={s.resultsHeading}>
            {isEnglish ? 'SCHOLARSHIP SCHEMES' : 'छात्रवृत्ति योजना परिणाम'} ({results.length})
          </Text>
        </View>

        {results.map((res) => {
          const isExp = expandedId === res.id;
          return (
            <View
              key={res.id}
              style={[
                s.schemeCard,
                res.isEligible ? s.schemeEligible : s.schemeIneligible,
              ]}
            >
              <View style={s.schemeTop}>
                <View style={s.schemeTitleArea}>
                  <Text style={s.schemeName}>{res.name}</Text>
                  <Text style={s.schemeDept}>{res.department}</Text>
                </View>
                <View
                  style={[
                    s.statusCapsule,
                    res.isEligible ? s.statusEligible : s.statusIneligible,
                  ]}
                >
                  <Text
                    style={[
                      s.statusText,
                      res.isEligible ? s.statusTextEligible : s.statusTextIneligible,
                    ]}
                  >
                    {res.isEligible
                      ? (isEnglish ? '✓ ELIGIBLE' : '✓ पात्र')
                      : (isEnglish ? '✕ NOT ELIGIBLE' : '✕ अपात्र')}
                  </Text>
                </View>
              </View>

              {res.isEligible && (
                <View style={s.amountRow}>
                  <Text style={s.amountTag}>
                    💰 {isEnglish ? 'Estimated Aid:' : 'अनुमानित सहायता:'}{' '}
                    <Text style={s.amountTagBold}>
                      ₹{(res.annualEstimatedInr || 0).toLocaleString('en-IN')}{' '}
                      {isEnglish ? '/ year' : '/ वर्ष'}
                    </Text>
                  </Text>
                </View>
              )}

              <Text style={s.schemeBenefit}>{res.benefitDescription}</Text>

              <TouchableOpacity
                style={s.expandBtn}
                onPress={() => setExpandedId(isExp ? null : res.id)}
                activeOpacity={0.7}
              >
                <Text style={s.expandBtnText}>
                  {isExp
                    ? (isEnglish ? '▲ Hide Checklist & Rules' : '▲ विवरण व नियम छुपाएं')
                    : (isEnglish ? '▼ View Rules & Checklist' : '▼ नियम एवं दस्तावेज़ चेकलिस्ट')}
                </Text>
              </TouchableOpacity>

              {isExp && (
                <View style={s.expandedBox}>
                  <Text style={s.expHeading}>
                    {isEnglish ? 'Eligibility Rules Evaluation:' : 'पात्रता नियम विश्लेषण:'}
                  </Text>
                  {res.rulesEvaluated.map((r, ri) => (
                    <View key={ri} style={s.ruleRow}>
                      <Text style={r.passed ? s.rulePassed : s.ruleFailed}>
                        {r.passed ? '✓' : '✕'}
                      </Text>
                      <Text style={s.ruleDesc}>
                        {r.rule}: <Text style={s.ruleReason}>{r.reason}</Text>
                      </Text>
                    </View>
                  ))}

                  <Text style={[s.expHeading, { marginTop: 10 }]}>
                    {isEnglish ? 'Required Documents for Application:' : 'आवेदन हेतु आवश्यक दस्तावेज़:'}
                  </Text>
                  {res.documentsRequired.map((doc, di) => (
                    <Text key={di} style={s.docItem}>
                      📄 {doc}
                    </Text>
                  ))}
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

    // Hero
    impactHero: {
      backgroundColor: theme.chromeBackground,
      borderRadius: RADIUS.lg,
      padding: isTablet ? SPACING.lg : SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.35)',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    impactTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    impactTag: {
      fontSize: 10,
      fontWeight: FONT.weights.extrabold,
      color: theme.primaryLight,
      letterSpacing: 0.5,
    },
    eligibleBadge: {
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.5)',
    },
    eligibleBadgeText: {
      fontSize: 9.5,
      fontWeight: FONT.weights.extrabold,
      color: '#34D399',
    },
    impactAmount: {
      fontSize: isTablet ? 34 : 28,
      fontWeight: FONT.weights.extrabold,
      color: '#F8FAFC',
    },
    impactPeriod: {
      fontSize: 14,
      color: '#94A3B8',
      fontWeight: FONT.weights.normal,
    },
    impactSub: {
      fontSize: 11,
      color: '#94A3B8',
      marginTop: 2,
    },

    // Profile Card
    profileCard: {
      backgroundColor: theme.surface,
      borderRadius: RADIUS.lg,
      padding: isTablet ? SPACING.lg : SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      elevation: 2,
    },
    profileCardHeader: {
      marginBottom: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.surfaceBorder,
      paddingBottom: 8,
    },
    profileCardTitle: {
      fontSize: FONT.sizes.base,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
    },
    profileCardSubtitle: {
      fontSize: 11,
      color: theme.textMuted,
      marginTop: 2,
    },
    fieldGroup: {
      marginBottom: SPACING.md,
    },
    fieldLabel: {
      fontSize: 11.5,
      fontWeight: FONT.weights.bold,
      color: theme.textPrimary,
      marginBottom: 6,
    },
    labelWithVal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    activeValBadge: {
      fontSize: 11,
      fontWeight: FONT.weights.extrabold,
      color: theme.primary,
    },
    pillRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    pill: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: RADIUS.sm,
      backgroundColor: theme.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.surfaceBorderAlt,
    },
    pillActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primaryLight,
    },
    pillText: {
      fontSize: FONT.sizes.xs,
      color: theme.textSecondary,
      fontWeight: FONT.weights.semibold,
    },
    pillTextActive: {
      color: '#FFFFFF',
      fontWeight: FONT.weights.extrabold,
    },
    pctPill: {
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: theme.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.surfaceBorderAlt,
    },
    pctPillText: {
      fontSize: 11,
      color: theme.textSecondary,
      fontWeight: FONT.weights.semibold,
    },
    incomeInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceAlt,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: theme.surfaceBorderAlt,
      paddingHorizontal: 12,
    },
    currencyPrefix: {
      fontSize: 15,
      fontWeight: FONT.weights.bold,
      color: theme.textMuted,
      marginRight: 6,
    },
    incomeInput: {
      flex: 1,
      height: 40,
      fontSize: 14,
      color: theme.textPrimary,
      fontWeight: FONT.weights.semibold,
    },
    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: theme.surfaceBorder,
    },
    toggleLabelGroup: {
      flex: 1,
      paddingRight: 10,
    },
    toggleTitle: {
      fontSize: 12,
      fontWeight: FONT.weights.bold,
      color: theme.textPrimary,
    },
    toggleDesc: {
      fontSize: 10,
      color: theme.textMuted,
      marginTop: 1,
    },

    // Results
    resultsHeader: {
      marginBottom: SPACING.sm,
    },
    resultsHeading: {
      fontSize: 12,
      fontWeight: FONT.weights.extrabold,
      color: theme.textMuted,
      letterSpacing: 0.5,
    },
    schemeCard: {
      backgroundColor: theme.surface,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      marginBottom: SPACING.sm + 4,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      borderLeftWidth: 4,
    },
    schemeEligible: {
      borderLeftColor: theme.success,
    },
    schemeIneligible: {
      borderLeftColor: theme.textXMuted,
      opacity: 0.85,
    },
    schemeTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 6,
    },
    schemeTitleArea: {
      flex: 1,
      paddingRight: 8,
    },
    schemeName: {
      fontSize: FONT.sizes.sm + 1,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
      lineHeight: 18,
    },
    schemeDept: {
      fontSize: 10,
      color: theme.textMuted,
      marginTop: 2,
    },
    statusCapsule: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: RADIUS.pill,
    },
    statusEligible: {
      backgroundColor: theme.successSoft,
      borderWidth: 1,
      borderColor: theme.successBorder,
    },
    statusIneligible: {
      backgroundColor: theme.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.surfaceBorderAlt,
    },
    statusText: {
      fontSize: 9.5,
      fontWeight: FONT.weights.extrabold,
    },
    statusTextEligible: {
      color: theme.successText,
    },
    statusTextIneligible: {
      color: theme.textMuted,
    },
    amountRow: {
      marginBottom: 6,
    },
    amountTag: {
      fontSize: 11,
      color: theme.successText,
    },
    amountTagBold: {
      fontWeight: FONT.weights.extrabold,
    },
    schemeBenefit: {
      fontSize: 11.5,
      color: theme.textSecondary,
      lineHeight: 16,
      marginBottom: 6,
    },
    expandBtn: {
      alignSelf: 'flex-start',
      paddingVertical: 4,
    },
    expandBtnText: {
      fontSize: 10.5,
      color: theme.primary,
      fontWeight: FONT.weights.bold,
    },
    expandedBox: {
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.surfaceBorder,
    },
    expHeading: {
      fontSize: 10.5,
      fontWeight: FONT.weights.bold,
      color: theme.textPrimary,
      marginBottom: 4,
    },
    ruleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 6,
      marginBottom: 3,
    },
    rulePassed: {
      color: theme.success,
      fontWeight: FONT.weights.extrabold,
      fontSize: 11,
    },
    ruleFailed: {
      color: theme.error,
      fontWeight: FONT.weights.extrabold,
      fontSize: 11,
    },
    ruleDesc: {
      fontSize: 10.5,
      color: theme.textSecondary,
      flex: 1,
    },
    ruleReason: {
      color: theme.textMuted,
      fontStyle: 'italic',
    },
    docItem: {
      fontSize: 10.5,
      color: theme.textSecondary,
      marginBottom: 2,
    },
  });
