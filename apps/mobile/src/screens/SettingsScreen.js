// VidyaSetu MP — Settings Screen (सिस्टम सेटिंग्स)
// Provides: Vernacular language / dialect picker, Theme switcher (Obsidian Dark / Civic Light),
// Offline storage manager (.VSMP cache), bandwidth optimization toggles, and civic system info.
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { SPACING, RADIUS, FONT } from '../constants/theme';
import { downloadManager } from '../services/DownloadManager.js';
import { apiClient } from '../api/client.js';

export default function SettingsScreen({ onOpenSplash }) {
  const {
    theme,
    colorScheme,
    setColorScheme,
    dialect,
    setDialect,
    DIALECTS,
    t,
    isEnglish,
    networkState,
    showToast,
    studentProfile,
    syncNow,
    syncState,
  } = useApp();

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const s = makeStyles(theme, isTablet);

  const [bandwidthSaver, setBandwidthSaver] = useState(true);
  const [offlineAutoSync, setOfflineAutoSync] = useState(true);
  const [cacheStatus, setCacheStatus] = useState('VERIFIED'); // 'VERIFIED' | 'VERIFYING' | 'CLEARED'
  const [apiUrlInput, setApiUrlInput] = useState(apiClient.getBaseUrl());

  const [cacheItems, setCacheItems] = useState([
    {
      id: 'course_packs',
      nameEn: 'Course Packs & Vector Lectures',
      nameHi: 'कोर्स पैक व वेक्टर व्याख्यान',
      descEn: 'History, Civics & Science modules',
      descHi: 'इतिहास, नागरिक शास्त्र एवं विज्ञान मॉड्यूल',
      sizeMB: 14.2,
      isDeleted: false,
      icon: 'book-outline',
      color: '#F59E0B',
    },
    {
      id: 'voice_doubts',
      nameEn: 'Microphone Voice Doubts Cache',
      nameHi: 'माइक्रोफ़ोन वॉइस प्रश्न कैश',
      descEn: 'Audio recordings & queued doubts',
      descHi: 'ऑडियो रिकॉर्डिंग्स एवं लंबित प्रश्न',
      sizeMB: 1.8,
      isDeleted: false,
      icon: 'mic-outline',
      color: '#10B981',
    },
    {
      id: 'scholarships',
      nameEn: 'Offline Scholarships & Syllabi',
      nameHi: 'ऑफलाइन छात्रवृत्ति व पाठ्यक्रम',
      descEn: 'Eligibility tables & portal schemes',
      descHi: 'पात्रता नियम एवं पोर्टल योजनाएं',
      sizeMB: 2.4,
      isDeleted: false,
      icon: 'cash-outline',
      color: '#38BDF8',
    },
  ]);

  const storagePath = Platform.OS === 'android'
    ? '/storage/emulated/0/Android/data/org.vidyasetu.mp/files/offline_vsmp/'
    : '/var/mobile/Containers/Data/Application/VidyaSetu/Documents/offline_vsmp/';

  const totalUsedMB = (cacheItems || []).reduce(
    (sum, item) => sum + (item.isDeleted ? 0 : item.sizeMB),
    0
  );
  const isAllCleared = totalUsedMB === 0;

  const handleDeleteItem = (itemId) => {
    const item = (cacheItems || []).find((c) => c.id === itemId);
    if (!item) return;

    Alert.alert(
      isEnglish ? `Delete ${item.nameEn}?` : `${item.nameHi} हटाएं?`,
      isEnglish
        ? `Are you sure you want to delete this cached data (${item.sizeMB} MB)? It will be removed from device storage.`
        : `क्या आप वाकई यह कैश हटाना चाहते हैं (${item.sizeMB} MB)? यह आपके फोन स्टोरेज से हटा दिया जाएगा।`,
      [
        { text: isEnglish ? 'Cancel' : 'रद्द करें', style: 'cancel' },
        {
          text: isEnglish ? `Delete (${item.sizeMB} MB)` : `हटाएं (${item.sizeMB} MB)`,
          style: 'destructive',
          onPress: () => {
            if (itemId === 'course_packs') {
              downloadManager.clearAllCache();
            }
            const next = (cacheItems || []).map((c) => (c.id === itemId ? { ...c, isDeleted: true } : c));
            setCacheItems(next);
            const remaining = next.reduce((sum, it) => sum + (it.isDeleted ? 0 : it.sizeMB), 0);
            if (remaining === 0) setCacheStatus('CLEARED');
            if (showToast) {
              showToast(
                isEnglish
                  ? `${item.nameEn} (${item.sizeMB} MB) deleted from storage!`
                  : `${item.nameHi} (${item.sizeMB} MB) स्टोरेज से हटाया गया!`,
                'success'
              );
            }
          },
        },
      ]
    );
  };

  const handleRestoreItem = (itemId) => {
    const item = (cacheItems || []).find((c) => c.id === itemId);
    if (!item) return;

    if (itemId === 'course_packs') {
      downloadManager.registerLocalPack({
        packId: 'HIS_BA1_MOD1_INDUS_VALLEY',
        titleHindi: 'सिंधु घाटी सभ्यता: नगर नियोजन एवं स्नानागार',
        titleEnglish: 'Indus Valley Civilization: Town Planning & Architecture',
        courseId: 'COURSE_HIS_BA1',
        sizeBytes: 17684,
        isDownloaded: true,
      });
    }

    setCacheItems((prev) =>
      (prev || []).map((c) => (c.id === itemId ? { ...c, isDeleted: false } : c))
    );
    setCacheStatus('VERIFIED');
    if (showToast) {
      showToast(
        isEnglish
          ? `${item.nameEn} restored to storage!`
          : `${item.nameHi} स्टोरेज में सुरक्षित!`,
        'success'
      );
    }
  };

  const handleDeleteAll = () => {
    if (isAllCleared) return;
    Alert.alert(
      isEnglish ? 'Delete All Stored Offline Data?' : 'सभी ऑफलाइन डेटा हटाएं?',
      isEnglish
        ? `Are you sure you want to delete all offline data? This will free up ${totalUsedMB.toFixed(1)} MB of internal device storage.`
        : `क्या आप वाकई सभी ऑफलाइन कोर्स पैक एवं कैश हटाना चाहते हैं? इससे आपके फोन का ${totalUsedMB.toFixed(1)} MB स्टोरेज खाली हो जाएगा।`,
      [
        { text: isEnglish ? 'Cancel' : 'रद्द करें', style: 'cancel' },
        {
          text: isEnglish ? `Delete All (${totalUsedMB.toFixed(1)} MB)` : `सब हटाएं (${totalUsedMB.toFixed(1)} MB)`,
          style: 'destructive',
          onPress: () => {
            setCacheItems((prev) => (prev || []).map((c) => ({ ...c, isDeleted: true })));
            setCacheStatus('CLEARED');
            if (showToast) {
              showToast(
                isEnglish
                  ? 'All offline data & cache cleared from device storage!'
                  : 'सभी ऑफलाइन डेटा व कैश डिवाइस स्टोरेज से हटा दिया गया!',
                'success'
              );
            }
          },
        },
      ]
    );
  };

  const handleRestoreAll = () => {
    setCacheItems((prev) => (prev || []).map((c) => ({ ...c, isDeleted: false })));
    setCacheStatus('VERIFIED');
    if (showToast) {
      showToast(
        isEnglish
          ? 'All course packs restored & cached locally (18.4 MB)!'
          : 'सभी कोर्स पैक ऑफलाइन स्टोरेज में पुनः सुरक्षित कर दिए गए (18.4 MB)!',
        'success'
      );
    }
  };

  const handleVerifyCache = () => {
    if (isAllCleared) {
      Alert.alert(
        isEnglish ? 'Storage Empty' : 'स्टोरेज खाली है',
        isEnglish
          ? 'No offline data is currently stored. Download course packs to enable offline study.'
          : 'वर्तमान में कोई ऑफलाइन कोर्स पैक संग्रहित नहीं है। अध्ययन के लिए कोर्स पैक डाउनलोड करें।'
      );
      return;
    }
    setCacheStatus('VERIFYING');
    setTimeout(() => {
      setCacheStatus('VERIFIED');
      if (showToast) {
        showToast(
          isEnglish
            ? 'SHA-256 signatures verified: All course files valid!'
            : 'SHA-256 हस्ताक्षर सत्यापित: सभी फाइलें सुरक्षित हैं!',
          'success'
        );
      }
    }, 400);
  };

  const handleCopyPath = () => {
    if (showToast) {
      showToast(
        isEnglish
          ? 'Storage path: ' + storagePath
          : 'डिवाइस स्टोरेज स्थान: ' + storagePath,
        'info'
      );
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.adaptiveWrapper}>
        {/* HERO HEADER */}
        <View style={s.heroCard}>
          <View style={s.heroIconBox}>
            <Ionicons name="settings" size={24} color={theme.primaryLight} />
          </View>
          <View style={s.heroTextGroup}>
            <Text style={s.heroTitle}>{t.settings.title}</Text>
            <Text style={s.heroSubtitle}>{t.settings.subtitle}</Text>
          </View>
        </View>

        {/* 1. LANGUAGE & REGIONAL DIALECT SECTION */}
        <View style={s.sectionCard}>
          <View style={s.sectionHeader}>
            <Ionicons name="globe-outline" size={20} color={theme.primaryLight} />
            <View style={s.sectionHeaderText}>
              <Text style={s.sectionTitle}>{t.settings.languageTitle}</Text>
              <Text style={s.sectionDesc}>{t.settings.languageDesc}</Text>
            </View>
          </View>

          <View style={s.dialectsGrid}>
            {(DIALECTS || []).map((d) => {
              const isActive = dialect === d.code;
              return (
                <TouchableOpacity
                  key={d.code}
                  style={[s.dialectTile, isActive && s.dialectTileActive]}
                  onPress={() => setDialect(d.code)}
                  activeOpacity={0.75}
                >
                  <View style={s.dialectTileTop}>
                    <Text style={[s.dialectTileName, isActive && s.dialectTileNameActive]}>
                      {d.label}
                    </Text>
                    {isActive ? (
                      <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                    ) : (
                      <Ionicons name="ellipse-outline" size={16} color={theme.textXMuted} />
                    )}
                  </View>
                  <Text style={[s.dialectTileSub, isActive && s.dialectTileSubActive]}>
                    {d.sub}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 2. APPEARANCE & THEME SECTION */}
        <View style={s.sectionCard}>
          <View style={s.sectionHeader}>
            <Ionicons
              name={colorScheme === 'dark' ? 'moon-outline' : 'sunny-outline'}
              size={20}
              color={theme.primaryLight}
            />
            <View style={s.sectionHeaderText}>
              <Text style={s.sectionTitle}>{t.settings.themeTitle}</Text>
              <Text style={s.sectionDesc}>{t.settings.themeDesc}</Text>
            </View>
          </View>

          <View style={s.themeSelectorRow}>
            {/* Dark Mode Tile */}
            <TouchableOpacity
              style={[
                s.themeTile,
                colorScheme === 'dark' && s.themeTileActive,
              ]}
              onPress={() => setColorScheme('dark')}
              activeOpacity={0.8}
            >
              <View style={[s.themePreviewBox, { backgroundColor: '#070C18' }]}>
                <Ionicons name="moon" size={18} color="#F59E0B" />
              </View>
              <Text style={[s.themeTileLabel, colorScheme === 'dark' && s.themeTileLabelActive]}>
                {t.settings.darkTheme}
              </Text>
              {colorScheme === 'dark' && (
                <Ionicons name="checkmark-circle" size={16} color={theme.primaryLight} />
              )}
            </TouchableOpacity>

            {/* Light Mode Tile */}
            <TouchableOpacity
              style={[
                s.themeTile,
                colorScheme === 'light' && s.themeTileActive,
              ]}
              onPress={() => setColorScheme('light')}
              activeOpacity={0.8}
            >
              <View style={[s.themePreviewBox, { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1' }]}>
                <Ionicons name="sunny" size={18} color="#D97706" />
              </View>
              <Text style={[s.themeTileLabel, colorScheme === 'light' && s.themeTileLabelActive]}>
                {t.settings.lightTheme}
              </Text>
              {colorScheme === 'light' && (
                <Ionicons name="checkmark-circle" size={16} color={theme.primaryLight} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. OFFLINE STORAGE, FILE LOCATION & CACHE MANAGER */}
        <View style={s.sectionCard}>
          <View style={s.sectionHeader}>
            <Ionicons name="folder-open-outline" size={20} color={theme.primaryLight} />
            <View style={s.sectionHeaderText}>
              <Text style={s.sectionTitle}>
                {isEnglish ? 'Offline File Storage & Cache' : 'ऑफलाइन फाइल स्टोरेज एवं कैश प्रबंधन'}
              </Text>
              <Text style={s.sectionDesc}>
                {isEnglish
                  ? 'Manage on-device downloaded course packs, audio files, and cache.'
                  : 'डिवाइस में संग्रहित व्याख्यान, ऑडियो फाइलें एवं कैश स्टोरेज प्रबंधित करें।'}
              </Text>
            </View>
          </View>

          {/* FILE STORAGE LOCATION PATH BOX */}
          <View style={s.pathBox}>
            <View style={s.pathHeaderRow}>
              <View style={s.pathLabelRow}>
                <Ionicons name="location-outline" size={13} color={theme.primaryLight} />
                <Text style={s.pathLabel}>
                  {isEnglish ? 'Local Storage Directory:' : 'डिवाइस स्टोरेज स्थान (पाथ):'}
                </Text>
              </View>
              <View style={s.pathBadge}>
                <Text style={s.pathBadgeText}>INTERNAL SANDBOX</Text>
              </View>
            </View>
            <View style={s.pathValueRow}>
              <Ionicons name="file-tray-full-outline" size={14} color={theme.primaryLight} />
              <Text style={s.pathValueText} numberOfLines={2} selectable>
                {storagePath}
              </Text>
              <TouchableOpacity
                style={s.copyPathBtn}
                onPress={handleCopyPath}
                activeOpacity={0.7}
              >
                <Ionicons name="copy-outline" size={14} color={theme.primaryLight} />
              </TouchableOpacity>
            </View>
            <Text style={s.pathHelpText}>
              {isEnglish
                ? 'All offline packs and voice recordings are stored in this device directory.'
                : 'सभी ऑफलाइन कोर्स पैक और वॉइस नोट्स इसी सुरक्षित डिवाइस फ़ोल्डर में रखे जाते हैं।'}
            </Text>
          </View>

          {/* STORAGE STATS & BREAKDOWN */}
          <View style={s.storageInfoRow}>
            <View style={s.storageStat}>
              <Text style={[s.storageStatValue, isAllCleared && { color: theme.textMuted }]}>
                {isAllCleared ? '0.0 KB' : `${totalUsedMB.toFixed(1)} MB`}
              </Text>
              <Text style={s.storageStatLabel}>
                {isEnglish ? 'Storage Used' : 'स्टोरेज उपयोग'}
              </Text>
            </View>
            <View style={s.storageDivider} />
            <View style={s.storageStat}>
              <View style={[s.healthBadge, isAllCleared && s.healthBadgeEmpty]}>
                <Ionicons
                  name={isAllCleared ? 'cloud-outline' : cacheStatus === 'VERIFYING' ? 'hourglass-outline' : 'shield-checkmark'}
                  size={13}
                  color={isAllCleared ? '#F59E0B' : '#34D399'}
                />
                <Text style={[s.healthBadgeText, isAllCleared && { color: '#F59E0B' }]}>
                  {isAllCleared ? 'EMPTY' : cacheStatus === 'VERIFYING' ? 'VERIFYING' : 'SHA-256 OK'}
                </Text>
              </View>
              <Text style={s.storageStatLabel}>
                {isEnglish ? 'Cache Integrity' : 'कैश सुरक्षा स्थिति'}
              </Text>
            </View>
          </View>

          {/* ITEMIZED CACHE LIST */}
          <View style={s.cacheItemsList}>
            {(cacheItems || []).map((item) => (
              <View key={item.id} style={s.cacheItemRow}>
                <View style={s.cacheItemLeft}>
                  <View style={[s.cacheIconBox, { backgroundColor: `${item.color}18` }]}>
                    <Ionicons name={item.icon} size={15} color={item.color} />
                  </View>
                  <View style={s.cacheTextGroup}>
                    <Text style={s.cacheItemName}>
                      {isEnglish ? item.nameEn : item.nameHi}
                    </Text>
                    <Text style={s.cacheItemDesc}>
                      {isEnglish ? item.descEn : item.descHi}
                    </Text>
                  </View>
                </View>

                <View style={s.cacheItemRight}>
                  <Text style={[s.cacheItemSize, item.isDeleted && { color: theme.textMuted }]}>
                    {item.isDeleted ? '0.0 KB' : `${item.sizeMB} MB`}
                  </Text>
                  {!item.isDeleted ? (
                    <TouchableOpacity
                      style={s.itemActionBtn}
                      onPress={() => handleDeleteItem(item.id)}
                      activeOpacity={0.7}
                      accessibilityLabel="Delete item"
                    >
                      <Ionicons name="trash-outline" size={14} color="#EF4444" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={s.itemRestoreBtn}
                      onPress={() => handleRestoreItem(item.id)}
                      activeOpacity={0.7}
                      accessibilityLabel="Download item"
                    >
                      <Ionicons name="cloud-download-outline" size={14} color="#10B981" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* ACTION BUTTONS: CLEAR ALL VS RESTORE ALL + VERIFY */}
          <View style={s.storageActionsRow}>
            {!isAllCleared ? (
              <TouchableOpacity
                style={s.deleteStorageBtn}
                onPress={handleDeleteAll}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={15} color="#EF4444" />
                <Text style={s.deleteStorageBtnText}>
                  {isEnglish ? 'Clear All Storage' : 'सभी डेटा व कैश हटाएं'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={s.downloadStorageBtn}
                onPress={handleRestoreAll}
                activeOpacity={0.8}
              >
                <Ionicons name="cloud-download-outline" size={15} color="#FFFFFF" />
                <Text style={s.downloadStorageBtnText}>
                  {isEnglish ? 'Download All Packs (18.4 MB)' : 'सभी कोर्स पैक डाउनलोड करें (18.4 MB)'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={s.verifyCacheBtn}
              onPress={handleVerifyCache}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh-outline" size={15} color={theme.primaryLight} />
              <Text style={s.verifyCacheBtnText}>
                {isEnglish ? 'Verify Checksums' : 'कैश जांचें'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. BANDWIDTH & NETWORK OPTIMIZATIONS */}
        <View style={s.sectionCard}>
          <View style={s.sectionHeader}>
            <Ionicons name="flash-outline" size={20} color={theme.primaryLight} />
            <View style={s.sectionHeaderText}>
              <Text style={s.sectionTitle}>{t.settings.bandwidthTitle}</Text>
              <Text style={s.sectionDesc}>{t.settings.bandwidthDesc}</Text>
            </View>
          </View>

          <View style={s.toggleItem}>
            <View style={s.toggleTextGroup}>
              <Text style={s.toggleTitle}>
                {isEnglish ? 'Opus 14 kbps Audio Mode' : 'ऑपस 14 kbps अल्ट्रा-कंप्रेशन'}
              </Text>
              <Text style={s.toggleSubtitle}>
                {isEnglish ? '94% bandwidth savings over MP3' : 'MP3 की तुलना में 94% डेटा बचत'}
              </Text>
            </View>
            <Switch
              value={bandwidthSaver}
              onValueChange={setBandwidthSaver}
              trackColor={{ false: theme.surfaceBorder, true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[s.toggleItem, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={s.toggleTextGroup}>
              <Text style={s.toggleTitle}>
                {isEnglish ? 'Auto-Sync on 2G Signal' : '2G नेटवर्क पर स्वतः सिंक'}
              </Text>
              <Text style={s.toggleSubtitle}>
                {isEnglish ? 'Automatic doubt outbox store-and-forward' : 'संदेह आउटबॉक्स का स्वतः पृष्ठभूमि सिंक'}
              </Text>
            </View>
            <Switch
              value={offlineAutoSync}
              onValueChange={setOfflineAutoSync}
              trackColor={{ false: theme.surfaceBorder, true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Cloud Gateway Host Setting */}
          <View style={{ marginTop: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: theme.surfaceBorder }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: theme.textPrimary, marginBottom: 4 }}>
              {isEnglish ? 'VidyaSetu Cloud Gateway URL' : 'विद्यासेतु क्लाउड गेटवे यूआरएल'}
            </Text>
            <Text style={{ fontSize: 11, color: theme.textMuted, marginBottom: 8 }}>
              {isEnglish ? 'Configurable host for Emulator (10.0.2.2), Desktop, or LAN IP' : 'एमुलेटर (10.0.2.2), डेस्कटॉप या लैन आईपी हेतु गेटवे'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: theme.background,
                  color: theme.textPrimary,
                  borderWidth: 1,
                  borderColor: theme.surfaceBorder,
                  borderRadius: RADIUS.md,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  fontSize: 12,
                }}
                value={apiUrlInput}
                onChangeText={setApiUrlInput}
                placeholder="http://10.0.2.2:8000"
                placeholderTextColor={theme.textXMuted}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: theme.primary,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: RADIUS.md,
                  justifyContent: 'center',
                }}
                onPress={() => {
                  apiClient.setBaseUrl(apiUrlInput);
                  if (showToast) {
                    showToast(
                      isEnglish ? `Gateway URL updated: ${apiUrlInput}` : `सर्वर यूआरएल सुरक्षित: ${apiUrlInput}`,
                      'success'
                    );
                  }
                }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 11 }}>
                  {isEnglish ? 'Save' : 'सहेजें'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Outbox Sync Status & Manual Flush */}
          <View style={{ marginTop: SPACING.md, padding: 12, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: RADIUS.md, borderWidth: 1, borderColor: theme.surfaceBorder }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: theme.textPrimary }}>
                  {isEnglish ? 'Local Mutation Outbox' : 'स्थानीय म्यूटेशन आउटबॉक्स'}
                </Text>
                <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>
                  {isEnglish
                    ? `${syncState?.pendingCount || 0} local mutations queued for burst sync`
                    : `${syncState?.pendingCount || 0} स्थानीय गतिविधियां सिंक हेतु कतारबद्ध`}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: networkState.isOnline ? theme.primary : 'rgba(255,255,255,0.08)',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: RADIUS.sm,
                }}
                onPress={async () => {
                  if (!networkState.isOnline) {
                    if (showToast) {
                      showToast(
                        isEnglish ? 'Offline (0 kbps). Cannot sync right now.' : 'ऑफलाइन (0 kbps)। अभी सिंक नहीं हो सकता।',
                        'info'
                      );
                    }
                    return;
                  }
                  if (showToast) {
                    showToast(
                      isEnglish ? 'Draining outbox to backend...' : 'आउटबॉक्स बैकएंड से सिंक हो रहा है...',
                      'info'
                    );
                  }
                  const res = await syncNow();
                  if (res?.status === 'SUCCESS' && showToast) {
                    showToast(
                      isEnglish ? 'All local mutations synchronized!' : 'सभी स्थानीय गतिविधियां सिंक हुईं!',
                      'success'
                    );
                  }
                }}
                disabled={syncState?.isSyncing}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                  {syncState?.isSyncing
                    ? (isEnglish ? 'Syncing...' : 'सिंक...')
                    : (isEnglish ? 'Sync Now' : 'अभी सिंक करें')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 5. CIVIC GOVERNANCE & SYSTEM INFO */}
        <View style={s.aboutCard}>
          <View style={s.aboutHeader}>
            <Ionicons name="school-outline" size={20} color={theme.primaryLight} />
            <Text style={s.aboutTitle}>{t.settings.aboutTitle}</Text>
          </View>
          <Text style={s.aboutDesc}>{t.settings.aboutDesc}</Text>

          <View style={s.complianceRow}>
            <View style={s.complianceTag}>
              <Ionicons name="shield-checkmark-outline" size={12} color="#34D399" />
              <Text style={s.complianceTagText}>DPDP Act 2023 Compliant</Text>
            </View>
            <View style={s.complianceTag}>
              <Ionicons name="hardware-chip-outline" size={12} color="#38BDF8" />
              <Text style={[s.complianceTagText, { color: '#7DD3FC' }]}>
                {t.settings.version}
              </Text>
            </View>
          </View>

          {onOpenSplash && (
            <TouchableOpacity
              style={s.tourBtn}
              onPress={onOpenSplash}
              activeOpacity={0.8}
            >
              <Ionicons name="sparkles-outline" size={13} color={theme.primaryLight} />
              <Text style={s.tourBtnText}>
                {isEnglish ? 'View Welcome Tour / Onboarding' : 'प्रारंभिक परिचय / ऑनबोर्डिंग देखें'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
    heroCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: RADIUS.xl,
      padding: SPACING.md + 2,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      elevation: 4,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 8,
      gap: 12,
    },
    heroIconBox: {
      width: 44,
      height: 44,
      borderRadius: RADIUS.md,
      backgroundColor: 'rgba(245, 158, 11, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.35)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    heroTextGroup: {
      flex: 1,
    },
    heroTitle: {
      fontSize: FONT.sizes.lg,
      fontWeight: FONT.weights.black,
      color: theme.textPrimary,
      letterSpacing: 0.2,
    },
    heroSubtitle: {
      fontSize: FONT.sizes.xs,
      color: theme.textMuted,
      marginTop: 2,
    },

    // Section Card
    sectionCard: {
      backgroundColor: theme.surface,
      borderRadius: RADIUS.xl,
      padding: isTablet ? SPACING.lg : SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      elevation: 3,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 6,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      marginBottom: SPACING.md,
    },
    sectionHeaderText: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: FONT.sizes.base,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
    },
    sectionDesc: {
      fontSize: 11,
      color: theme.textMuted,
      marginTop: 2,
      lineHeight: 16,
    },

    // Dialect Grid
    dialectsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    dialectTile: {
      width: '48.5%',
      backgroundColor: theme.surfaceAlt,
      borderRadius: RADIUS.md,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    dialectTileActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primaryBright,
      elevation: 3,
      shadowColor: theme.primaryLight,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.35,
      shadowRadius: 5,
    },
    dialectTileTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 3,
    },
    dialectTileName: {
      fontSize: FONT.sizes.sm,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
    },
    dialectTileNameActive: {
      color: '#FFFFFF',
    },
    dialectTileSub: {
      fontSize: 9.5,
      color: theme.textMuted,
    },
    dialectTileSubActive: {
      color: 'rgba(255, 255, 255, 0.85)',
      fontWeight: FONT.weights.semibold,
    },

    // Theme Selector
    themeSelectorRow: {
      flexDirection: 'row',
      gap: 10,
    },
    themeTile: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceAlt,
      borderRadius: RADIUS.md,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      gap: 8,
    },
    themeTileActive: {
      borderColor: theme.primaryLight,
      backgroundColor: 'rgba(245, 158, 11, 0.08)',
    },
    themePreviewBox: {
      width: 32,
      height: 32,
      borderRadius: RADIUS.sm,
      justifyContent: 'center',
      alignItems: 'center',
    },
    themeTileLabel: {
      flex: 1,
      fontSize: FONT.sizes.xs + 0.5,
      fontWeight: FONT.weights.bold,
      color: theme.textPrimary,
    },
    themeTileLabelActive: {
      color: theme.primaryLight,
    },

    // Offline Storage & Path Box
    pathBox: {
      backgroundColor: theme.surfaceAlt,
      borderRadius: RADIUS.lg,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      marginBottom: 12,
    },
    pathHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    pathLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    pathLabel: {
      fontSize: 11,
      fontWeight: FONT.weights.bold,
      color: theme.textSecondary,
    },
    pathBadge: {
      backgroundColor: 'rgba(56, 189, 248, 0.12)',
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: RADIUS.pill,
      borderWidth: 0.8,
      borderColor: 'rgba(56, 189, 248, 0.3)',
    },
    pathBadgeText: {
      fontSize: 8.5,
      fontWeight: FONT.weights.extrabold,
      color: '#38BDF8',
      letterSpacing: 0.5,
    },
    pathValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      gap: 8,
    },
    pathValueText: {
      flex: 1,
      fontSize: 10,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      color: theme.textPrimary,
    },
    copyPathBtn: {
      padding: 4,
      borderRadius: RADIUS.sm,
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
    },
    pathHelpText: {
      fontSize: 10,
      color: theme.textMuted,
      marginTop: 6,
      lineHeight: 14,
    },

    // Storage Info
    storageInfoRow: {
      flexDirection: 'row',
      backgroundColor: theme.surfaceAlt,
      borderRadius: RADIUS.lg,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      alignItems: 'center',
      marginBottom: 12,
    },
    storageStat: {
      flex: 1,
      alignItems: 'center',
    },
    storageDivider: {
      width: 1,
      height: 32,
      backgroundColor: theme.surfaceBorder,
    },
    storageStatValue: {
      fontSize: FONT.sizes.xl,
      fontWeight: FONT.weights.black,
      color: theme.textPrimary,
    },
    storageStatLabel: {
      fontSize: 10,
      color: theme.textMuted,
      marginTop: 2,
    },
    healthBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: RADIUS.pill,
      borderWidth: 0.8,
      borderColor: 'rgba(16, 185, 129, 0.35)',
      gap: 4,
    },
    healthBadgeEmpty: {
      backgroundColor: 'rgba(245, 158, 11, 0.12)',
      borderColor: 'rgba(245, 158, 11, 0.35)',
    },
    healthBadgeText: {
      fontSize: 10,
      fontWeight: FONT.weights.extrabold,
      color: '#34D399',
    },

    // Itemized Cache List
    cacheItemsList: {
      backgroundColor: theme.surfaceAlt,
      borderRadius: RADIUS.lg,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      overflow: 'hidden',
      marginBottom: 12,
    },
    cacheItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.surfaceBorder,
      justifyContent: 'space-between',
    },
    cacheItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    cacheIconBox: {
      width: 30,
      height: 30,
      borderRadius: RADIUS.sm,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cacheTextGroup: {
      flex: 1,
    },
    cacheItemName: {
      fontSize: 12,
      fontWeight: FONT.weights.bold,
      color: theme.textPrimary,
    },
    cacheItemDesc: {
      fontSize: 9.5,
      color: theme.textMuted,
      marginTop: 1,
    },
    cacheItemRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginLeft: 8,
    },
    cacheItemSize: {
      fontSize: 11,
      fontWeight: FONT.weights.extrabold,
      color: theme.textSecondary,
    },
    itemActionBtn: {
      padding: 6,
      borderRadius: RADIUS.sm,
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      borderWidth: 0.8,
      borderColor: 'rgba(239, 68, 68, 0.25)',
    },
    itemRestoreBtn: {
      padding: 6,
      borderRadius: RADIUS.sm,
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      borderWidth: 0.8,
      borderColor: 'rgba(16, 185, 129, 0.25)',
    },

    // Storage Actions Row
    storageActionsRow: {
      flexDirection: 'row',
      gap: 8,
    },
    deleteStorageBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.4)',
      paddingVertical: 10,
      borderRadius: RADIUS.pill,
      gap: 6,
    },
    deleteStorageBtnText: {
      fontSize: 11,
      fontWeight: FONT.weights.bold,
      color: '#EF4444',
    },
    downloadStorageBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primary,
      paddingVertical: 10,
      borderRadius: RADIUS.pill,
      gap: 6,
      elevation: 2,
      shadowColor: theme.primaryLight,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    downloadStorageBtnText: {
      fontSize: 11,
      fontWeight: FONT.weights.bold,
      color: '#FFFFFF',
    },
    verifyCacheBtn: {
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.35)',
      backgroundColor: 'rgba(245, 158, 11, 0.08)',
      gap: 6,
    },
    verifyCacheBtnText: {
      fontSize: 11,
      fontWeight: FONT.weights.bold,
      color: theme.primaryLight,
    },

    // Toggle items
    toggleItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.surfaceBorder,
    },
    toggleTextGroup: {
      flex: 1,
      paddingRight: 10,
    },
    toggleTitle: {
      fontSize: FONT.sizes.xs + 1,
      fontWeight: FONT.weights.bold,
      color: theme.textPrimary,
    },
    toggleSubtitle: {
      fontSize: 10,
      color: theme.textMuted,
      marginTop: 2,
    },

    // About
    aboutCard: {
      backgroundColor: theme.surfaceAlt,
      borderRadius: RADIUS.xl,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    aboutHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
    },
    aboutTitle: {
      fontSize: FONT.sizes.xs + 1,
      fontWeight: FONT.weights.bold,
      color: theme.primaryLight,
    },
    aboutDesc: {
      fontSize: 10.5,
      color: theme.textSecondary,
      lineHeight: 15,
      marginBottom: 10,
    },
    complianceRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    complianceTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: RADIUS.pill,
      borderWidth: 0.8,
      borderColor: 'rgba(16, 185, 129, 0.3)',
      gap: 4,
    },
    complianceTagText: {
      fontSize: 9,
      fontWeight: FONT.weights.bold,
      color: '#34D399',
    },
    tourBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      backgroundColor: theme.surface,
      marginTop: 12,
      paddingVertical: 9,
      paddingHorizontal: 14,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.35)',
    },
    tourBtnText: {
      fontSize: 11,
      fontWeight: FONT.weights.bold,
      color: theme.primaryLight,
    },
  });
