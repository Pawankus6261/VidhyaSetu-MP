// VidyaSetu MP — In-App Toast Banner
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { SPACING, RADIUS, FONT } from '../constants/theme';

export default function ToastBanner() {
  const { activeToast, hideToast, theme } = useApp();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  if (!activeToast) return null;

  const isSuccess = activeToast.type === 'SCHEME' || activeToast.type === 'success';
  const isWarning = activeToast.type === 'warning';
  const isMic = activeToast.type === 'mic';

  let iconName = 'checkmark-circle';
  let iconColor = '#10B981';
  let borderColor = 'rgba(16, 185, 129, 0.4)';
  let bgColor = 'rgba(8, 14, 28, 0.95)';

  if (isMic) {
    iconName = 'mic';
    iconColor = theme.primaryLight;
    borderColor = 'rgba(245, 158, 11, 0.4)';
  } else if (isWarning) {
    iconName = 'alert-circle';
    iconColor = '#F59E0B';
    borderColor = 'rgba(245, 158, 11, 0.4)';
  } else if (!isSuccess) {
    iconName = 'information-circle';
    iconColor = '#38BDF8';
    borderColor = 'rgba(56, 189, 248, 0.4)';
  }

  const s = makeStyles(theme, isTablet, borderColor, bgColor);

  return (
    <View style={s.toastWrapper} pointerEvents="box-none">
      <View style={s.toastCard}>
        <Ionicons name={iconName} size={18} color={iconColor} />
        <Text style={s.toastMessage} numberOfLines={2}>
          {activeToast.message}
        </Text>
        <TouchableOpacity style={s.dismissBtn} onPress={hideToast} activeOpacity={0.7}>
          <Ionicons name="close" size={14} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (theme, isTablet, borderColor, bgColor) =>
  StyleSheet.create({
    toastWrapper: {
      position: 'absolute',
      top: 60,
      left: 0,
      right: 0,
      zIndex: 9999,
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    toastCard: {
      width: '100%',
      maxWidth: isTablet ? 540 : 400,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: bgColor,
      borderRadius: RADIUS.pill,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: borderColor,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
    },
    toastMessage: {
      flex: 1,
      fontSize: 12,
      fontWeight: FONT.weights.semibold,
      color: '#FFFFFF',
      lineHeight: 16,
    },
    dismissBtn: {
      padding: 4,
    },
  });
