import { Alert, Platform } from 'react-native';

/**
 * Cross-platform alert helper that works seamlessly on iOS, Android, and Web browsers.
 */
export const showAlert = (title, message, buttons) => {
  if (Platform.OS === 'web') {
    if (buttons && buttons.length > 1) {
      const confirmText = buttons.find((b) => b.style !== 'cancel')?.text || 'OK';
      const confirmed = window.confirm(`${title}\n\n${message}`);
      if (confirmed) {
        const actionBtn = buttons.find((b) => b.onPress && b.style !== 'cancel');
        if (actionBtn && actionBtn.onPress) {
          actionBtn.onPress();
        }
      } else {
        const cancelBtn = buttons.find((b) => b.style === 'cancel');
        if (cancelBtn && cancelBtn.onPress) {
          cancelBtn.onPress();
        }
      }
    } else {
      window.alert(`${title}\n\n${message}`);
      if (buttons && buttons[0] && buttons[0].onPress) {
        buttons[0].onPress();
      }
    }
  } else {
    Alert.alert(title, message, buttons);
  }
};

export default showAlert;
