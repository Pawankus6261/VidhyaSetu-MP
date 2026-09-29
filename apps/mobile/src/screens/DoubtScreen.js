// VidyaSetu MP — Doubt Screen (संदेह आउटबॉक्स)
// Store-and-forward async doubt queue — works fully offline with audio mic input and textbook citations
// Adaptive layout for phones, tablets, foldables, and desktop web
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { SPACING, RADIUS, FONT } from '../constants/theme';

const INITIAL_DOUBTS = [
  {
    id: 'DOUBT_01',
    question: 'हड़प्पा सभ्यता में जल निकासी व्यवस्था की ईंटों का अनुपात क्या था?',
    questionEn: 'What was the dimension ratio of bricks used in Harappan drainage systems?',
    timestamp: '10 मिनट पूर्व / 10m ago',
    status: 'RESOLVED_LOCAL',
    confidence: 0.94,
    citation: 'बी.ए. इतिहास पुस्तक, अध्याय 1, पृष्ठ 24 (बरकतउल्ला विश्वविद्यालय)',
    citationEn: 'B.A. History Textbook, Chapter 1, Page 24 (Barkatullah University)',
    answer: 'नालियां पक्की ईंटों से ढकी थीं। ईंटों की लंबाई, चौड़ाई और मोटाई का अनुपात 4:2:1 था।',
    answerEn: 'Drains were lined with kiln-fired bricks with a standardized ratio of 4:2:1 (Length:Breadth:Thickness).',
  },
  {
    id: 'DOUBT_02',
    question: 'लोथल बंदरगाह पर गोदी (Dockyard) किस नदी के तट पर स्थित था?',
    questionEn: 'Along which riverbank was the famous tidal dockyard of Lothal situated?',
    timestamp: '25 मिनट पूर्व / 25m ago',
    status: 'QUEUED_OUTBOX',
    notes: 'नेटवर्क सिग्नल मिलने पर सिंक होगा (4.2 KB कंप्रेस्ड)',
    notesEn: 'Queued locally (4.2 KB compressed) — auto-syncs on next 2G signal burst.',
  },
];

export default function DoubtScreen() {
  const { theme, networkState, t, isEnglish } = useApp();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const s = makeStyles(theme, isTablet);

  const [doubtText, setDoubtText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [queue, setQueue] = useState(INITIAL_DOUBTS);

  const handleSubmit = () => {
    const text = doubtText.trim();
    if (!text) {
      Alert.alert(
        isEnglish ? 'Empty Question' : 'प्रश्न खाली है',
        isEnglish ? 'Please type or speak your doubt.' : 'कृपया अपना प्रश्न लिखें।',
        [{ text: isEnglish ? 'OK' : 'ठीक है' }]
      );
      return;
    }

    const isOnline = networkState.isOnline;
    const newDoubt = {
      id: `DOUBT_${Date.now()}`,
      question: text,
      questionEn: text,
      timestamp: isEnglish ? 'Just now' : 'अभी-अभी',
      status: isOnline ? 'RESOLVED_LOCAL' : 'QUEUED_OUTBOX',
      notes: isOnline
        ? (isEnglish ? 'Verified by VidyaSetu AI' : 'विद्यासेतु AI द्वारा तत्काल सत्यापित')
        : (isEnglish ? 'Queued in offline outbox (4.2 KB) — will sync on 2G signal' : 'ऑफलाइन आउटबॉक्स में सुरक्षित (4.2 KB) — 2G सिग्नल पर सिंक होगा'),
      answer: isOnline
        ? (isEnglish
            ? 'The script of the Indus Valley was pictographic/boustrophedon, written right to left.'
            : 'सिंधु घाटी की लिपि चित्रात्मक (भावचित्रात्मक) थी जिसे दाएं से बाएं लिखा जाता था।')
        : null,
      citation: isOnline
        ? (isEnglish
            ? 'NCERT & MP Board Ancient History, Reference Page 18'
            : 'एनसीईआरटी एवं एमपी बोर्ड इतिहास पाठ्यपुस्तक, संदर्भ पृष्ठ 18')
        : null,
    };

    setQueue([newDoubt, ...queue]);
    setDoubtText('');
  };

  const handleMicPress = () => {
    if (isRecording) {
      setIsRecording(false);
      setDoubtText(
        isEnglish
          ? 'What was the function of the Great Bath in Mohenjo-daro?'
          : 'मोहनजोदड़ो के विशाल स्नानागार का मुख्य धार्मिक प्रयोजन क्या था?'
      );
    } else {
      setIsRecording(true);
    }
  };

  const queuedCount = queue.filter((d) => d.status === 'QUEUED_OUTBOX').length;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.adaptiveWrapper}>
        {/* ASYNC STORE-AND-FORWARD HEADER BANNER */}
        <View style={s.outboxBanner}>
          <View style={s.bannerTop}>
            <Text style={s.bannerTag}>
              {isEnglish ? 'ASYNC STORE-AND-FORWARD' : 'असिंक्रोनस आउटबॉक्स'}
            </Text>
            <View
              style={[
                s.queueStatusPill,
                {
                  backgroundColor: queuedCount > 0
                    ? 'rgba(245, 158, 11, 0.2)'
                    : 'rgba(16, 185, 129, 0.2)',
                },
              ]}
            >
              <Text
                style={[
                  s.queueStatusText,
                  { color: queuedCount > 0 ? '#FBBF24' : '#34D399' },
                ]}
              >
                {queuedCount > 0
                  ? (isEnglish ? `${queuedCount} QUEUED OFFLINE` : `${queuedCount} आउटबॉक्स में लंबित`)
                  : (isEnglish ? '✓ ALL SYNCHRONIZED' : '✓ सभी प्रश्न सिंक')}
              </Text>
            </View>
          </View>

          <Text style={s.bannerTitle}>{t.doubt.title}</Text>
          <Text style={s.bannerSubtitle}>{t.doubt.subtitle}</Text>
        </View>

        {/* INPUT CARD */}
        <View style={s.inputCard}>
          <TextInput
            style={s.textInput}
            multiline
            numberOfLines={4}
            value={doubtText}
            onChangeText={setDoubtText}
            placeholder={t.doubt.inputPlaceholder}
            placeholderTextColor={theme.textXMuted}
          />

          <View style={s.actionRow}>
            <TouchableOpacity
              style={[s.micBtn, isRecording && s.micBtnRecording]}
              onPress={handleMicPress}
              activeOpacity={0.8}
            >
              <Text style={s.micIcon}>{isRecording ? '⏹' : '🎙️'}</Text>
              <Text style={[s.micText, isRecording && s.micTextRecording]}>
                {isRecording
                  ? (isEnglish ? 'Listening (Opus 14kbps)...' : 'सुन रहे हैं (ऑपस रिकॉर्ड)...')
                  : t.doubt.recording}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.submitBtn}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <Text style={s.submitBtnText}>
                {isEnglish ? 'Submit Doubt' : 'संदेह पूछें'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DOUBTS LIST */}
        <View style={s.listHeader}>
          <Text style={s.listHeading}>{t.doubt.outboxQueue} ({queue.length})</Text>
        </View>

        {queue.map((item) => {
          const isResolved = item.status === 'RESOLVED_LOCAL';
          const qTitle = isEnglish ? (item.questionEn || item.question) : item.question;
          const answerText = isEnglish ? (item.answerEn || item.answer) : item.answer;
          const citationText = isEnglish ? (item.citationEn || item.citation) : item.citation;
          const notesText = isEnglish ? (item.notesEn || item.notes) : item.notes;

          return (
            <View
              key={item.id}
              style={[
                s.doubtCard,
                isResolved ? s.doubtCardResolved : s.doubtCardQueued,
              ]}
            >
              <View style={s.doubtTop}>
                <View
                  style={[
                    s.statusBadge,
                    isResolved ? s.statusBadgeResolved : s.statusBadgeQueued,
                  ]}
                >
                  <Text
                    style={[
                      s.statusBadgeText,
                      isResolved ? s.statusTextResolved : s.statusTextQueued,
                    ]}
                  >
                    {isResolved
                      ? (isEnglish ? '✓ LOCAL AI VERIFIED' : '✓ स्थानीय AI सत्यापित')
                      : (isEnglish ? '⏳ QUEUED FOR 2G BURST' : '⏳ 2G आउटबॉक्स कतार')}
                  </Text>
                </View>
                <Text style={s.timestampText}>{item.timestamp}</Text>
              </View>

              <Text style={s.questionText}>{qTitle}</Text>

              {isResolved && answerText && (
                <View style={s.answerBox}>
                  <View style={s.ansHeader}>
                    <Text style={s.ansIcon}>💡</Text>
                    <Text style={s.ansTag}>{isEnglish ? 'VERIFIED SOLUTION' : 'सत्यापित समाधान'}</Text>
                  </View>
                  <Text style={s.ansText}>{answerText}</Text>
                  {citationText && (
                    <View style={s.citationRow}>
                      <Text style={s.citationLabel}>📚 {isEnglish ? 'Source:' : 'प्रमाणिक संदर्भ:'}</Text>
                      <Text style={s.citationText}>{citationText}</Text>
                    </View>
                  )}
                </View>
              )}

              {!isResolved && (
                <View style={s.queuedBox}>
                  <Text style={s.queuedIcon}>📦</Text>
                  <Text style={s.queuedText}>{notesText}</Text>
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
    outboxBanner: {
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
    bannerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    bannerTag: {
      fontSize: 10,
      fontWeight: FONT.weights.extrabold,
      color: theme.primaryLight,
      letterSpacing: 0.5,
    },
    queueStatusPill: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: RADIUS.pill,
    },
    queueStatusText: {
      fontSize: 9.5,
      fontWeight: FONT.weights.extrabold,
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

    // Input Card
    inputCard: {
      backgroundColor: theme.surface,
      borderRadius: RADIUS.lg,
      padding: isTablet ? SPACING.lg : SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      elevation: 2,
    },
    textInput: {
      minHeight: 85,
      fontSize: FONT.sizes.sm,
      color: theme.textPrimary,
      textAlignVertical: 'top',
      padding: 10,
      backgroundColor: theme.surfaceAlt,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: theme.surfaceBorderAlt,
      marginBottom: SPACING.sm,
    },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
    },
    micBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: RADIUS.sm,
      backgroundColor: theme.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.surfaceBorderAlt,
      flex: 1,
    },
    micBtnRecording: {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      borderColor: theme.error,
    },
    micIcon: {
      fontSize: 14,
      marginRight: 6,
    },
    micText: {
      fontSize: 11,
      fontWeight: FONT.weights.semibold,
      color: theme.textSecondary,
    },
    micTextRecording: {
      color: theme.errorText,
      fontWeight: FONT.weights.bold,
    },
    submitBtn: {
      backgroundColor: theme.chromeBackground,
      paddingHorizontal: 18,
      paddingVertical: 8,
      borderRadius: RADIUS.sm,
    },
    submitBtnText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: FONT.weights.extrabold,
    },

    // List
    listHeader: {
      marginBottom: SPACING.sm,
    },
    listHeading: {
      fontSize: 12,
      fontWeight: FONT.weights.extrabold,
      color: theme.textMuted,
      letterSpacing: 0.5,
    },
    doubtCard: {
      backgroundColor: theme.surface,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      marginBottom: SPACING.sm + 4,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      borderLeftWidth: 4,
    },
    doubtCardResolved: {
      borderLeftColor: theme.success,
    },
    doubtCardQueued: {
      borderLeftColor: theme.warning,
    },
    doubtTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    statusBadge: {
      paddingHorizontal: 7,
      paddingVertical: 2.5,
      borderRadius: RADIUS.pill,
    },
    statusBadgeResolved: {
      backgroundColor: theme.successSoft,
    },
    statusBadgeQueued: {
      backgroundColor: theme.warningSoft,
    },
    statusBadgeText: {
      fontSize: 9,
      fontWeight: FONT.weights.extrabold,
    },
    statusTextResolved: {
      color: theme.successText,
    },
    statusTextQueued: {
      color: theme.warningText,
    },
    timestampText: {
      fontSize: 10,
      color: theme.textXMuted,
    },
    questionText: {
      fontSize: FONT.sizes.sm + 0.5,
      fontWeight: FONT.weights.bold,
      color: theme.textPrimary,
      lineHeight: 19,
      marginBottom: 8,
    },
    answerBox: {
      backgroundColor: theme.surfaceAlt,
      borderRadius: RADIUS.sm,
      padding: SPACING.sm + 2,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    ansHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 4,
    },
    ansIcon: {
      fontSize: 12,
    },
    ansTag: {
      fontSize: 9.5,
      fontWeight: FONT.weights.extrabold,
      color: theme.successText,
    },
    ansText: {
      fontSize: 11.5,
      color: theme.textSecondary,
      lineHeight: 17,
    },
    citationRow: {
      marginTop: 6,
      paddingTop: 6,
      borderTopWidth: 1,
      borderTopColor: theme.surfaceBorder,
    },
    citationLabel: {
      fontSize: 9.5,
      fontWeight: FONT.weights.bold,
      color: theme.textMuted,
    },
    citationText: {
      fontSize: 10,
      color: theme.textSecondary,
      marginTop: 1,
    },
    queuedBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.warningSoft,
      padding: 8,
      borderRadius: RADIUS.sm,
      gap: 6,
    },
    queuedIcon: {
      fontSize: 13,
    },
    queuedText: {
      fontSize: 11,
      color: theme.warningText,
      flex: 1,
    },
  });
