import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import {  clearError } from '../../redux/slices/authSlice';
import { COLORS } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ResetPasswordScreen = ({  route }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, error } = useSelector((state) => state.auth);
  const { email, token } = route.params;

  const handleResetPassword = async () => {
    setFormError('');
    if (!password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }
    // Navigate directly to SuccessScreen
    navigation.navigate('SuccessScreen');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (error) {
    Alert.alert('Error', error, [
      { text: 'OK', onPress: () => dispatch(clearError()) },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.navigationBar}>
                {/* Back Arrow at the top */}
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={26} color="#6C63FF" />
                </TouchableOpacity>
                </View>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.logoContainer}>
                    <Image source={require('../../Assets/image/Novologo.png')} style={styles.logo} />
                  </View>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter your new password</Text>

            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="New Password"
                  placeholderTextColor={COLORS.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={22}
                    color={COLORS.textLight}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm Password"
                  placeholderTextColor={COLORS.textLight}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Icon
                    name={showConfirmPassword ? 'eye' : 'eye-off'}
                    size={22}
                    color={COLORS.textLight}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {formError ? (
              <Text style={styles.formErrorText}>
                {formError}
              </Text>
            ) : null}

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetPassword}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.resetButtonText}>Reset Password</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Remove unused bottom back button for clarity */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //padding: 16,
    //backgroundColor: '#FFFFFF',
    top: 50,
    left: 10,
    //bottom: 0,
  },
  backButton: {
    // position: "absolute",
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'center',
  },
   logoContainer: {
      alignItems: 'center',
      marginBottom: 0,
      //marginTop: -40, // Move logo upward
    },
    logo: {
      width: 250,
      height: 150,
      bottom:10,
      //resizeMode: 'contain',
      // marginTop:20,
      //marginBottom: 50,
    },
  logoText: {
    color: COLORS.white,
    fontSize: width * 0.09,
    fontWeight: 'bold',
  },
  formContainer: {
    marginBottom: 160,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderBlockColor: COLORS.primary,
    paddingVertical: 20,
    borderWidth: 1,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    gap: 18,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F4F6FA',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    marginBottom: 2,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    color: COLORS.text,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  eyeIcon: {
    padding: 5,
  },
  resetButton: {
    backgroundColor: COLORS.primaryDark,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
  },
  resetButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    gap: 6,
  },
  backText: {
    color: COLORS.textLight,
    fontSize: 15,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  formErrorText: {
    color: '#ff3b30',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: 'bold',
  },
});

export default ResetPasswordScreen;
