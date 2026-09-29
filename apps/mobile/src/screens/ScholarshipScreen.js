// VidyaSetu MP — Scholarship Screen (छात्रवृत्ति)
// Features: Offline deterministic eligibility engine, profile tuner, document checklists, full English & Hindi support, Adaptive Screen Layout
// Real Vector Icons via @expo/vector-icons, Optimistic UI Navigation, Zero Emojis
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
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { evaluateScholarships } from '../services/ScholarshipEngine';
import { SPACING, RADIUS, FONT } from '../constants/theme';
import { scholarshipsApi } from '../api/index.js';
import { syncEngine } from '../services/SyncEngine.js';

const CATEGORY_OPTIONS = ['ST', 'SC', 'OBC', 'GEN'];
const PERCENTAGE_OPTIONS = [45, 55, 68, 75, 85, 90];

export default function ScholarshipScreen() {
  const { theme, t, isEnglish, networkState, showToast, studentProfile, setStudentProfile } = useApp();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const s = makeStyles(theme, isTablet);

  const [profile, setProfile] = useState({
    category: studentProfile?.social_category || 'ST',
    gender: studentProfile?.gender || 'FEMALE',
    annualIncome: studentProfile?.family_annual_income || 120000,
    twelfthPercentage: studentProfile?.twelfth_percentage || 74,
    hasSambalCard: studentProfile?.has_sambal_card !== false,
    isRentingRoom: false,
  });

  const [results, setResults] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [incomeText, setIncomeText] = useState(String(studentProfile?.family_annual_income || 120000));

  // Civic Document Verification State
  const [docType, setDocType] = useState('SAMAGRA_ID'); // 'SAMAGRA_ID' | 'DIGITAL_CASTE_CERTIFICATE'
  const [docInput, setDocInput] = useState(studentProfile?.samagra_id || '194829104');
  const [docVerifying, setDocVerifying] = useState(false);
  const [docResult, setDocResult] = useState(null);

  useEffect(() => {
    // 1. Instantaneous offline deterministic evaluation (0 kbps safety)
    const localMatches = evaluateScholarships(profile);
    setResults(localMatches);

    // 2. Enqueue profile update mutation for background sync
    syncEngine.enqueueMutation('scholarship_audit', 'STUDENT_AUDIT', 'UPSERT', {
      ...profile,
      timestamp: Date.now(),
    });
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

  const handleVerifyDoc = async () => {
    if (!docInput.trim()) return;
    setDocVerifying(true);
    setDocResult(null);
    try {
      const res = await scholarshipsApi.verifyDocument(docType, docInput.trim());
      setDocVerifying(false);
      if (res.isSuccess && res.data) {
        setDocResult(res.data);
        if (showToast) {
          showToast(
            res.data.is_valid
              ? (isEnglish ? `Verified ${res.data.doc_type} format!` : `${res.data.doc_type} प्रारूप प्रमाणित!`)
              : (res.data.error_message || 'Format check failed'),
            res.data.is_valid ? 'success' : 'info'
          );
        }
      }
    } catch (err) {
      setDocVerifying(false);
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.adaptiveWrapper}>
        {/* FINANCIAL IMPACT HERO SUMMARY */}
        <View style={s.impactHero}>
          <View style={s.impactTop}>
            <View style={s.engineTag}>
              <Ionicons name="shield-checkmark" size={12} color={theme.primaryLight} />
              <Text style={s.engineTagText}>
                {isEnglish ? 'OFFLINE DETERMINISTIC MATCH' : 'ऑफलाइन पात्रता मिलान'}
              </Text>
            </View>
            <View style={s.eligibleBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#34D399" />
              <Text style={s.eligibleBadgeText}>
                {eligibleCount}/{results.length} {isEnglish ? 'ELIGIBLE' : 'पात्र योजनाएं'}
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
            <View style={s.profileHeaderRow}>
              <Ionicons name="person-circle-outline" size={20} color={theme.primaryLight} />
              <Text style={s.profileCardTitle}>{t.scholarship.title}</Text>
            </View>
            <Text style={s.profileCardSubtitle}>{t.scholarship.subtitle}</Text>
          </View>

          {/* Social Category */}
          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>{t.scholarship.category}:</Text>
            <View style={s.pillRow}>
              {CATEGORY_OPTIONS.map((cat) => {
                const isActive = profile.category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[s.pill, isActive && s.pillActive]}
                    onPress={() => setProfile((p) => ({ ...p, category: cat }))}
                    activeOpacity={0.75}
                  >
                    <Text style={[s.pillText, isActive && s.pillTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Gender */}
          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>{t.scholarship.gender}:</Text>
            <View style={s.pillRow}>
              {[
                { key: 'FEMALE', label: t.scholarship.female },
                { key: 'MALE',   label: t.scholarship.male },
              ].map((g) => {
                const isActive = profile.gender === g.key;
                return (
                  <TouchableOpacity
                    key={g.key}
                    style={[s.pill, isActive && s.pillActive]}
                    onPress={() => setProfile((p) => ({ ...p, gender: g.key }))}
                    activeOpacity={0.75}
                  >
                    <Text style={[s.pillText, isActive && s.pillTextActive]}>
                      {g.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 12th Percentage */}
          <View style={s.fieldGroup}>
            <View style={s.labelWithVal}>
              <Text style={s.fieldLabel}>{t.scholarship.twelfthMarks}:</Text>
              <Text style={s.activeValBadge}>{profile.twelfthPercentage}%</Text>
            </View>
            <View style={s.pillRow}>
              {PERCENTAGE_OPTIONS.map((pct) => {
                const isActive = profile.twelfthPercentage === pct;
                return (
                  <TouchableOpacity
                    key={pct}
                    style={[s.pctPill, isActive && s.pillActive]}
                    onPress={() => setProfile((p) => ({ ...p, twelfthPercentage: pct }))}
                    activeOpacity={0.75}
                  >
                    <Text style={[s.pctPillText, isActive && s.pillTextActive]}>
                      {pct}%
                    </Text>
                  </TouchableOpacity>
                );
              })}
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

        {/* CIVIC DOCUMENT FORMAT VERIFIER (PRE-SUBMISSION) */}
        <View style={[s.profileCard, { marginTop: SPACING.sm }]}>
          <View style={s.profileCardHeader}>
            <View style={s.profileHeaderRow}>
              <Ionicons name="shield-checkmark-outline" size={18} color={theme.primaryLight} />
              <Text style={s.profileCardTitle}>
                {isEnglish ? 'Civic Document Format Verifier' : 'दस्तावेज़ प्रारूप सत्यापन'}
              </Text>
            </View>
            <Text style={s.profileCardSubtitle}>
              {isEnglish
                ? 'Check Samagra ID (9 digits) or Digital Caste (16 digits) validity offline & online.'
                : '9-अंकीय समग्र आईडी अथवा 16-अंकीय डिजिटल जाति प्रमाण पत्र का प्रारूप जांचें।'}
            </Text>
          </View>

          {/* Type Selector */}
          <View style={s.fieldGroup}>
            <View style={s.pillRow}>
              {[
                { key: 'SAMAGRA_ID', label: isEnglish ? 'Samagra ID (9 digits)' : 'समग्र आईडी (9 अंक)' },
                { key: 'DIGITAL_CASTE_CERTIFICATE', label: isEnglish ? 'Digital Caste (16 digits)' : 'डिजिटल जाति (16 अंक)' },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={[s.pill, docType === opt.key && s.pillActive]}
                  onPress={() => {
                    setDocType(opt.key);
                    setDocResult(null);
                  }}
                  activeOpacity={0.75}
                >
                  <Text style={[s.pillText, docType === opt.key && s.pillTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Doc Input & Verify Button */}
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <View style={[s.incomeInputWrapper, { flex: 1 }]}>
              <TextInput
                style={s.incomeInput}
                value={docInput}
                onChangeText={setDocInput}
                placeholder={docType === 'SAMAGRA_ID' ? '194829104' : 'RS/410/0123/4567/8901'}
                placeholderTextColor={theme.textXMuted}
              />
            </View>
            <TouchableOpacity
              style={[s.pillActive, { paddingVertical: 10, paddingHorizontal: 14, borderRadius: RADIUS.md }]}
              onPress={handleVerifyDoc}
              disabled={docVerifying}
              activeOpacity={0.8}
            >
              <Text style={[s.pillTextActive, { fontWeight: '700' }]}>
                {docVerifying ? '...' : (isEnglish ? 'Verify' : 'सत्यापित करें')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Result Alert Badge */}
          {docResult && (
            <View
              style={{
                marginTop: 10,
                padding: 10,
                borderRadius: RADIUS.md,
                backgroundColor: docResult.is_valid ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderWidth: 1,
                borderColor: docResult.is_valid ? 'rgba(52, 211, 153, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Ionicons
                name={docResult.is_valid ? 'checkmark-circle' : 'alert-circle'}
                size={16}
                color={docResult.is_valid ? '#34D399' : '#EF4444'}
              />
              <Text
                style={{
                  fontSize: 11.5,
                  color: docResult.is_valid ? '#34D399' : '#EF4444',
                  fontWeight: '600',
                  flex: 1,
                }}
              >
                {docResult.is_valid
                  ? (isEnglish ? `Valid format: ${docResult.formatted_value}` : `प्रारूप वैध: ${docResult.formatted_value}`)
                  : (docResult.error_message || 'Format check failed')}
              </Text>
            </View>
          )}
        </View>

        {/* RESULTS LIST */}
        <View style={s.resultsHeader}>
          <Text style={s.resultsHeading}>
            {isEnglish ? 'SCHOLARSHIP SCHEMES' : 'छात्रवृत्ति योजना परिणाम'} ({(results || []).length})
          </Text>
        </View>

        {(results || []).map((res) => {
          const isExp = expandedId === res.id;
          const schemeTitle = isEnglish ? (res.titleEn || res.title || res.name) : (res.title || res.name);
          const schemeDept = isEnglish ? (res.departmentEn || res.department) : res.department;
          const schemeBenefit = isEnglish ? (res.benefitEn || res.benefit || res.benefitDescription) : (res.benefit || res.benefitDescription);

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
                  <Text style={s.schemeName}>{schemeTitle}</Text>
                  <Text style={s.schemeDept}>{schemeDept}</Text>
                </View>
                <View
                  style={[
                    s.statusCapsule,
                    res.isEligible ? s.statusEligible : s.statusIneligible,
                  ]}
                >
                  <Ionicons
                    name={res.isEligible ? 'checkmark-circle' : 'close-circle'}
                    size={11}
                    color={res.isEligible ? '#34D399' : '#F59E0B'}
                  />
                  <Text
                    style={[
                      s.statusText,
                      res.isEligible ? s.statusTextEligible : s.statusTextIneligible,
                    ]}
                  >
                    {res.isEligible
                      ? (isEnglish ? 'ELIGIBLE' : 'पात्र')
                      : (isEnglish ? 'NOT ELIGIBLE' : 'अपात्र')}
                  </Text>
                </View>
              </View>

              {/* Benefit & Aid Detail */}
              <View style={s.benefitCard}>
                <View style={s.benefitIconRow}>
                  <Ionicons name="sparkles" size={11} color={theme.primaryLight} />
                  <Text style={s.benefitLabel}>
                    {isEnglish ? 'SCHEME BENEFIT' : 'योजना लाभ व सहायता'}
                  </Text>
                </View>
                <Text style={s.schemeBenefit}>{schemeBenefit}</Text>
              </View>

              {/* Meta row: Amount + Portal tag */}
              <View style={s.cardMetaRow}>
                {res.isEligible && (
                  <View style={s.amountRow}>
                    <Ionicons name="cash-outline" size={13} color="#10B981" />
                    <Text style={s.amountTag}>
                      {isEnglish ? 'Est. Aid:' : 'अनुमानित:'}{' '}
                      <Text style={s.amountTagBold}>
                        ₹{(res.annualEstimatedInr || 0).toLocaleString('en-IN')}{' '}
                        {isEnglish ? '/yr' : '/वर्ष'}
                      </Text>
                    </Text>
                  </View>
                )}

                {res.portal && (
                  <View style={s.portalPill}>
                    <Ionicons name="globe-outline" size={11} color={theme.textMuted} />
                    <Text style={s.portalText} numberOfLines={1}>{res.portal}</Text>
                  </View>
                )}
              </View>

              {/* Ineligible reason alert strip */}
              {!res.isEligible && res.rejectionReasons && res.rejectionReasons.length > 0 && (
                <View style={s.ineligibleAlert}>
                  <Ionicons name="alert-circle-outline" size={13} color="#F59E0B" />
                  <Text style={s.ineligibleAlertText}>
                    {res.rejectionReasons[0]}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={s.expandBtn}
                onPress={() => setExpandedId(isExp ? null : res.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isExp ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color={theme.primaryLight}
                />
                <Text style={s.expandBtnText}>
                  {isExp
                    ? (isEnglish ? 'Hide Checklist & Evaluation Rules' : 'नियम व दस्तावेज़ छुपाएं')
                    : (isEnglish ? 'View Rules & Required Documents' : 'पात्रता नियम एवं दस्तावेज़ चेकलिस्ट')}
                </Text>
              </TouchableOpacity>

              {isExp && (
                <View style={s.expandedBox}>
                  <Text style={s.expHeading}>
                    {isEnglish ? 'Eligibility Rules Evaluation:' : 'पात्रता नियम विश्लेषण:'}
                  </Text>
                  {(res.rulesEvaluated || []).map((r, ri) => (
                    <View key={ri} style={s.ruleRow}>
                      <Ionicons
                        name={r.passed ? 'checkmark-circle' : 'close-circle'}
                        size={13}
                        color={r.passed ? theme.success : theme.error}
                      />
                      <Text style={s.ruleDesc}>
                        {r.rule}: <Text style={s.ruleReason}>{r.reason}</Text>
                      </Text>
                    </View>
                  ))}

                  <Text style={[s.expHeading, { marginTop: 10 }]}>
                    {isEnglish ? 'Required Documents for Application:' : 'आवेदन हेतु आवश्यक दस्तावेज़:'}
                  </Text>
                  {(res.documentsRequired || res.requiredDocs || []).map((doc, di) => (
                    <View key={di} style={s.docItemRow}>
                      <Ionicons name="document-text-outline" size={13} color={theme.textMuted} />
                      <Text style={s.docItem}>{doc}</Text>
                    </View>
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
      paddingBottom: 95,
      alignItems: 'center',
    },
    adaptiveWrapper: {
      width: '100%',
      maxWidth: isTablet ? 760 : '100%',
    },

    // Hero
    impactHero: {
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
    impactTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    engineTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(245, 158, 11, 0.12)',
      paddingHorizontal: 8,
      paddingVertical: 3.5,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.35)',
      gap: 5,
    },
    engineTagText: {
      fontSize: 9.5,
      fontWeight: FONT.weights.black,
      color: theme.primaryLight,
      letterSpacing: 0.4,
    },
    eligibleBadge: {
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
    eligibleBadgeText: {
      fontSize: 9.5,
      fontWeight: FONT.weights.extrabold,
      color: '#34D399',
    },
    impactAmount: {
      fontSize: isTablet ? 36 : 30,
      fontWeight: FONT.weights.black,
      color: theme.textPrimary,
      letterSpacing: -0.5,
      marginTop: 4,
    },
    impactPeriod: {
      fontSize: 14,
      color: theme.textMuted,
      fontWeight: FONT.weights.medium,
    },
    impactSub: {
      fontSize: 11,
      color: theme.textMuted,
      marginTop: 4,
      lineHeight: 16,
    },

    // Profile Card
    profileCard: {
      backgroundColor: theme.surface,
      borderRadius: RADIUS.xl,
      padding: isTablet ? SPACING.lg : SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      elevation: 3,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 8,
    },
    profileCardHeader: {
      marginBottom: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.surfaceBorder,
      paddingBottom: 8,
    },
    profileHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
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
      color: theme.primaryLight,
    },
    pillRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    pill: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: RADIUS.pill,
      backgroundColor: theme.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    pillActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primaryBright,
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
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: RADIUS.pill,
      backgroundColor: theme.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
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
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      paddingHorizontal: 12,
    },
    currencyPrefix: {
      fontSize: 16,
      fontWeight: FONT.weights.extrabold,
      color: theme.primaryLight,
      marginRight: 6,
    },
    incomeInput: {
      flex: 1,
      height: 42,
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
      marginTop: 2,
    },

    // Results
    resultsHeader: {
      marginBottom: SPACING.sm,
      width: '100%',
    },
    resultsHeading: {
      fontSize: 11,
      fontWeight: FONT.weights.extrabold,
      color: theme.textMuted,
      letterSpacing: 0.6,
    },
    schemeCard: {
      backgroundColor: theme.surface,
      borderRadius: RADIUS.xl,
      padding: SPACING.md,
      marginBottom: SPACING.sm + 4,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      elevation: 3,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 8,
    },
    schemeEligible: {
      borderColor: 'rgba(16, 185, 129, 0.35)',
    },
    schemeIneligible: {
      borderColor: theme.surfaceBorder,
      opacity: 0.85,
    },
    schemeTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    schemeTitleArea: {
      flex: 1,
      paddingRight: 8,
    },
    schemeName: {
      fontSize: FONT.sizes.sm + 1,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
      lineHeight: 19,
    },
    schemeDept: {
      fontSize: 10,
      color: theme.textMuted,
      marginTop: 2,
    },
    statusCapsule: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      gap: 4,
    },
    statusEligible: {
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      borderColor: 'rgba(16, 185, 129, 0.35)',
    },
    statusIneligible: {
      backgroundColor: theme.surfaceAlt,
      borderColor: theme.surfaceBorder,
    },
    statusText: {
      fontSize: 9,
      fontWeight: FONT.weights.black,
      letterSpacing: 0.3,
    },
    statusTextEligible: {
      color: '#34D399',
    },
    statusTextIneligible: {
      color: theme.textMuted,
    },
    benefitCard: {
      backgroundColor: theme.surfaceAlt,
      borderRadius: RADIUS.md,
      padding: 10,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    benefitIconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginBottom: 3,
    },
    benefitLabel: {
      fontSize: 9.5,
      fontWeight: FONT.weights.extrabold,
      color: theme.primaryLight,
      letterSpacing: 0.5,
    },
    schemeBenefit: {
      fontSize: 12,
      color: theme.textPrimary,
      lineHeight: 18,
      fontWeight: FONT.weights.medium,
    },
    cardMetaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    amountRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      paddingHorizontal: 9,
      paddingVertical: 4.5,
      borderRadius: RADIUS.sm,
      gap: 5,
      borderWidth: 0.5,
      borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    amountTag: {
      fontSize: 11,
      color: '#34D399',
      fontWeight: FONT.weights.medium,
    },
    amountTagBold: {
      fontWeight: FONT.weights.extrabold,
      color: '#10B981',
    },
    portalPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: theme.surfaceAlt,
      paddingHorizontal: 8,
      paddingVertical: 4.5,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    portalText: {
      fontSize: 10,
      color: theme.textMuted,
      fontWeight: FONT.weights.medium,
      maxWidth: 220,
    },
    ineligibleAlert: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(245, 158, 11, 0.08)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.25)',
      marginBottom: 8,
    },
    ineligibleAlertText: {
      fontSize: 10.5,
      color: '#FBBF24',
      fontWeight: FONT.weights.semibold,
      flex: 1,
    },
    expandBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingVertical: 4,
      gap: 5,
    },
    expandBtnText: {
      fontSize: 10.5,
      color: theme.primaryLight,
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
      marginBottom: 4,
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
    docItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4,
    },
    docItem: {
      fontSize: 10.5,
      color: theme.textSecondary,
    },
  });
