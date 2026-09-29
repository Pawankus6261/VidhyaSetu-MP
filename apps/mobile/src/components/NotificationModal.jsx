// VidyaSetu MP — Civic & Academic Notification Center Modal
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { SPACING, RADIUS, FONT } from '../constants/theme';

export default function NotificationModal({ visible, onClose }) {
  const { theme, notifications, unreadCount, markAllRead, markRead, isEnglish } = useApp();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const s = makeStyles(theme, isTablet);

  const [filter, setFilter] = useState('ALL');

  const filteredNotifs = (notifications || []).filter((n) => {
    if (filter === 'ALL') return true;
    return n.type === filter;
  });

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        <View style={s.modalContainer}>
          {/* Header */}
          <View style={s.modalHeader}>
            <View style={s.titleRow}>
              <View style={s.bellIconBox}>
                <Ionicons name="notifications" size={18} color={theme.primaryLight} />
              </View>
              <Text style={s.modalTitle}>
                {isEnglish ? 'Notifications' : 'सूचना केंद्र'}
              </Text>
              {unreadCount > 0 && (
                <View style={s.unreadBadge}>
                  <Text style={s.unreadBadgeText}>{unreadCount} {isEnglish ? 'new' : 'नई'}</Text>
                </View>
              )}
            </View>

            <View style={s.headerActions}>
              {unreadCount > 0 && (
                <TouchableOpacity
                  style={s.markReadBtn}
                  onPress={markAllRead}
                  activeOpacity={0.7}
                >
                  <Ionicons name="checkmark-done-outline" size={14} color={theme.primaryLight} />
                  <Text style={s.markReadText}>
                    {isEnglish ? 'Read all' : 'सभी पढ़ें'}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={s.closeBtn}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Category Tabs */}
          <View style={s.filterRow}>
            {[
              { key: 'ALL', label: isEnglish ? 'All' : 'सभी', count: notifications.length },
              {
                key: 'SCHEME',
                label: isEnglish ? 'Schemes' : 'योजनाएं',
                count: notifications.filter((n) => n.type === 'SCHEME').length,
              },
              {
                key: 'ACADEMIC',
                label: isEnglish ? 'Academic' : 'अकादमिक',
                count: notifications.filter((n) => n.type === 'ACADEMIC').length,
              },
            ].map((tab) => {
              const active = filter === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[s.tabPill, active && s.tabPillActive]}
                  onPress={() => setFilter(tab.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.tabPillText, active && s.tabPillTextActive]}>
                    {tab.label} ({tab.count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Notifications Feed */}
          <ScrollView
            style={s.notifList}
            contentContainerStyle={s.notifListContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredNotifs.length === 0 ? (
              <View style={s.emptyBox}>
                <Ionicons name="notifications-off-outline" size={32} color={theme.textXMuted} />
                <Text style={s.emptyText}>
                  {isEnglish ? 'No notifications in this category' : 'इस श्रेणी में कोई नई सूचना नहीं है'}
                </Text>
              </View>
            ) : (
              filteredNotifs.map((item) => {
                const titleText = isEnglish ? (item.titleEn || item.title) : item.title;
                const msgText = isEnglish ? (item.messageEn || item.message) : item.message;
                const timeText = isEnglish ? (item.timeEn || item.time) : item.time;
                const isUnread = !item.read;

                let iconName = 'megaphone-outline';
                let iconColor = theme.primaryLight;
                if (item.type === 'SCHEME') {
                  iconName = 'cash-outline';
                  iconColor = '#10B981';
                } else if (item.type === 'ACADEMIC') {
                  iconName = 'school-outline';
                  iconColor = '#38BDF8';
                }

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[s.notifCard, isUnread && s.notifCardUnread]}
                    onPress={() => markRead(item.id)}
                    activeOpacity={0.85}
                  >
                    <View style={s.notifTop}>
                      <View style={s.notifTypeRow}>
                        <View style={[s.typeIconBox, { backgroundColor: `${iconColor}15` }]}>
                          <Ionicons name={iconName} size={13} color={iconColor} />
                        </View>
                        <Text style={[s.typeTag, { color: iconColor }]}>
                          {item.type === 'SCHEME'
                            ? (isEnglish ? 'SCHEME ALERT' : 'छात्रवृत्ति सूचना')
                            : (item.type === 'ACADEMIC'
                              ? (isEnglish ? 'ACADEMIC SYNC' : 'अकादमिक सिंक')
                              : (isEnglish ? 'SYSTEM' : 'सिस्टम'))}
                        </Text>
                      </View>
                      <View style={s.timeGroup}>
                        <Text style={s.timeText}>{timeText}</Text>
                        {isUnread && <View style={s.unreadDot} />}
                      </View>
                    </View>

                    <Text style={s.notifTitle}>{titleText}</Text>
                    <Text style={s.notifMessage}>{msgText}</Text>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (theme, isTablet) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACING.md,
    },
    modalContainer: {
      width: '100%',
      maxWidth: isTablet ? 560 : 440,
      maxHeight: '80%',
      backgroundColor: theme.surface,
      borderRadius: RADIUS.xl,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      padding: SPACING.md,
      elevation: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: SPACING.sm + 2,
      borderBottomWidth: 1,
      borderBottomColor: theme.surfaceBorder,
      marginBottom: SPACING.sm,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    bellIconBox: {
      width: 30,
      height: 30,
      borderRadius: RADIUS.sm,
      backgroundColor: 'rgba(245, 158, 11, 0.12)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
    },
    unreadBadge: {
      backgroundColor: 'rgba(245, 158, 11, 0.18)',
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: RADIUS.pill,
      borderWidth: 0.5,
      borderColor: theme.primary,
    },
    unreadBadgeText: {
      fontSize: 10,
      color: theme.primaryLight,
      fontWeight: FONT.weights.bold,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    markReadBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: RADIUS.sm,
      backgroundColor: theme.surfaceAlt,
    },
    markReadText: {
      fontSize: 11,
      color: theme.primaryLight,
      fontWeight: FONT.weights.semibold,
    },
    closeBtn: {
      width: 28,
      height: 28,
      borderRadius: RADIUS.pill,
      backgroundColor: theme.surfaceAlt,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Tabs
    filterRow: {
      flexDirection: 'row',
      gap: 6,
      marginBottom: SPACING.sm,
    },
    tabPill: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: RADIUS.pill,
      backgroundColor: theme.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    tabPillActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primaryBright,
    },
    tabPillText: {
      fontSize: 11,
      color: theme.textSecondary,
      fontWeight: FONT.weights.semibold,
    },
    tabPillTextActive: {
      color: '#FFFFFF',
      fontWeight: FONT.weights.extrabold,
    },

    // Feed
    notifList: {
      flexGrow: 0,
    },
    notifListContent: {
      gap: 8,
      paddingBottom: 4,
    },
    notifCard: {
      backgroundColor: theme.surfaceAlt,
      borderRadius: RADIUS.lg,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    notifCardUnread: {
      borderColor: 'rgba(245, 158, 11, 0.35)',
      backgroundColor: 'rgba(245, 158, 11, 0.04)',
    },
    notifTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    notifTypeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    typeIconBox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    typeTag: {
      fontSize: 9.5,
      fontWeight: FONT.weights.extrabold,
      letterSpacing: 0.4,
    },
    timeGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    timeText: {
      fontSize: 10,
      color: theme.textXMuted,
      fontWeight: FONT.weights.medium,
    },
    unreadDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.primaryLight,
    },
    notifTitle: {
      fontSize: 13,
      fontWeight: FONT.weights.extrabold,
      color: theme.textPrimary,
      marginBottom: 3,
    },
    notifMessage: {
      fontSize: 11.5,
      color: theme.textSecondary,
      lineHeight: 16,
    },
    emptyBox: {
      alignItems: 'center',
      paddingVertical: 32,
      gap: 8,
    },
    emptyText: {
      fontSize: 12,
      color: theme.textMuted,
      fontWeight: FONT.weights.medium,
    },
  });
