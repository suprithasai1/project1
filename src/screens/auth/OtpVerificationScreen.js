import React, { useRef, useState, useEffect } from  'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { clearError } from '../../redux/slices/authSlice';
import { COLORS } from '../../constants/theme';

const OTP_LENGTH = 6;

const OtpVerificationScreen = ({ route }) => {
  const { email } = route.params || { email: '' };
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, error } = useSelector((state) => state.auth);
  const [resendTimer, setResendTimer] = useState(0);
  const [localError, setLocalError] = useState('');

  const handleOtpChange = (text, idx) => {
    if (/^[0-9]?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[idx] = text;
      setOtp(newOtp);
      if (text && idx < OTP_LENGTH - 1) {
        inputRefs.current[idx + 1].focus();
      }
    }
  };

  const handleKeyPress = (e, idx) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1].focus();
    }
  };
  //const handleVerify = () => {
//     if (otp === expectedOtp) {
//       Alert.alert("Success", "OTP verified!");
//       navigation.navigate("ResetPassword", { email });
//     } else {
//       Alert.alert("Error", "Invalid OTP. Please try again.");
//     }
//   };
const handleVerify = async () => {
    // Combine OTP digits into a string
    const otpString = otp.join('');
    setLocalError('');
    dispatch(clearError());

    // Always navigate to ResetPassword, regardless of verification result
    navigation.navigate('ResetPassword', { email });
  };

  const handleResend = () => {
    if (resendTimer > 0) {return;}
    Alert.alert('Resend OTP', 'A new verification code has been sent to your email');
    setOtp(Array(OTP_LENGTH).fill(''));
    setResendTimer(60);
    inputRefs.current[0]?.focus();
    setLocalError('');
    dispatch(clearError());
  };

  // Timer effect for resend
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Clear error on OTP change
  useEffect(() => {
    if (localError || error) setLocalError('');
  }, [otp, error, localError]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Absolutely positioned back arrow at the top left, outside the card */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={26} color="#6C63FF" />
        </TouchableOpacity>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Verification Required</Text>
          <Text style={styles.subtitle}>
            A message with a verification code has been sent to your email
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, idx) => (
              <Pressable
                key={idx}
                onPress={() => inputRefs.current[idx]?.focus()}
                style={[
                  styles.otpBox,
                  focusedIndex === idx && styles.otpBoxFocused,
                  digit && styles.otpBoxFilled,
                ]}
              >
                <Text style={styles.otpDigit}>{digit}</Text>
                <TextInput
                  ref={ref => (inputRefs.current[idx] = ref)}
                  value={digit}
                  onChangeText={text => handleOtpChange(text, idx)}
                  onKeyPress={e => handleKeyPress(e, idx)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={styles.otpHiddenInput}
                  onFocus={() => setFocusedIndex(idx)}
                  blurOnSubmit={false}
                  autoFocus={idx === 0}
                />
              </Pressable>
            ))}
          </View>

          {/* Error message */}
          {(localError || error) ? (
            <Text style={styles.errorText}>{localError || error}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.verifyButtonText}>Verify</Text>
            )}
          </TouchableOpacity>


          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive code?</Text>
            <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
              <Text style={[styles.resendLink, resendTimer > 0 && styles.resendLinkDisabled]}>
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  navigationBar: {
    // unused, replaced by absolute backButton
  },
  backButton: {
    position: 'absolute',
    top: 36,
    left: 16,
    zIndex: 10,
    backgroundColor: 'transparent',
    padding: 4,
    borderRadius: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5856D6',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 10,
    gap: 10,
  },
  otpBox: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: '#d1d5fa',
    borderRadius: 10,
    marginHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5ff',
    shadowColor: '#5856D6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    transitionProperty: 'border-color',
    transitionDuration: '200ms',
  },
  otpBoxFocused: {
    borderColor: '#5856D6',
    backgroundColor: '#edeaff',
    shadowOpacity: 0.18,
    elevation: 4,
  },
  otpBoxFilled: {
    borderColor: '#6C63FF',
    backgroundColor: '#e6e4ff',
  },
  otpDigit: {
    fontSize: 20,
    color: '#2d2d4d',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  otpHiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  verifyButton: {
    backgroundColor: '#5856D6',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 6,
  },
  resendText: {
    color: '#888',
    fontSize: 15,
  },
  resendLink: {
    color: '#5856D6',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 0,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  resendLinkDisabled: {
    color: '#aaa',
  },
});

export default OtpVerificationScreen;
