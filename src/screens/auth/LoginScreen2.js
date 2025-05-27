import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
//import PatientListScreen from '../PatientListScreen';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

//import Icon from 'react-native-vector-icons/MaterialIcons';
import TouchID from 'react-native-touch-id';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Ionicons from 'react-native-vector-icons/Ionicons';
//import TouchID from 'react-native-touch-id';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

 const handleLogin = () => {
  const validEmail = 'doctor@gmail.com';
  const validPassword = 'test';

  if (username && password) {
    try {
      if (username !== validEmail) {
        Alert.alert('Invalid Email', 'This email is not registered');
      } else if (password !== validPassword) {
        Alert.alert('Wrong Password', 'invalid password');
      } else {
        console.log('Navigating to PatientListScreen');
        navigation.navigate('PatientListScreen');
      }
    } catch (error) {
      console.log('Navigation error:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  } else {
    Alert.alert('Error', 'Please enter username and password');
  }
};


  const handleTouchID = () => {
    const optionalConfigObject = {
      title: 'Authentication Required',
      imageColor: COLORS.primary,
      imageErrorColor: COLORS.error,
      sensorDescription: 'Touch sensor',
      sensorErrorDescription: 'Failed',
      cancelText: 'Cancel',
      fallbackLabel: 'Use Passcode',
    };

    TouchID.isSupported(optionalConfigObject)
      .then(biometryType => {
        TouchID.authenticate('Authenticate with Fingerprint', optionalConfigObject)
          .then(() => {
            Alert.alert('Success', 'Authenticated successfully');
            navigation.navigate('PatientListScreen');
          })
          .catch(() => {
            Alert.alert('Error', 'Authentication failed');
          });
      })
      .catch(error => {
        Alert.alert(
          'Fingerprint Not Available',
          'Your device does not support fingerprint authentication or it is not set up.'
        );
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Image source={require('../../Assets/image/Novologo.png')} style={styles.logo} />
        </View>


        <View style={styles.formContainer}>
          <Text style={styles.title}>Hospital Login</Text>
          <View style={styles.inputContainer}>

            <Ionicons name="mail" size={24} color={COLORS.primary}  />


            <TextInput
              style={[styles.input, {paddingLeft: 10}]}
              placeholder="Email"
              value={username}
              onChangeText={setUsername}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={24} color={COLORS.primary}  
            //style={styles.icon} 
            />
            <TextInput
              style={[styles.input, {paddingLeft: 10}]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.touchIdButton} onPress={handleTouchID}>
          <Ionicons name="finger-print-outline" size={40} color={COLORS.primary} style={styles.touchIdIcon} />
          <Text style={styles.touchIdText}>Tap to use Fingerprint</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
          <Text style={styles.forgotPassword}>Forgot password ?</Text>
        </TouchableOpacity>

      </ScrollView>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      padding:20,
      justifyContent: 'center',
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginBottom: 20,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 0,
    },
    logo: {
      width: 250,
      height: 150,
      resizeMode: 'contain',
      marginTop:0,
    },
    title: {
      ...FONTS.h2,
      color: COLORS.primaryDark,
      textAlign: 'center',
      marginBottom: 40,
      fontFamily: 'Inter-Bold',
      fontSize: 24,
      lineHeight: 30,
      fontWeight: 'bold',
      //textDecorationLine: 'underline',
    },
    formContainer: {
      width: '106%',
      height: '56%',
      backgroundColor: COLORS.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:0,
      marginBottom: 50,
      borderWidth: 1,
      borderColor: COLORS.primary,
      padding: 20,
      borderRadius: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: COLORS.primary,
      borderRadius: 8,
      backgroundColor: COLORS.white,
      paddingHorizontal: 10,
      marginBottom: 25,
      height: 50,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: COLORS.text,
      paddingLeft: 10, // Add padding to avoid overlap with the icon
    },
    eyeIcon: {
      position: 'absolute',
      right: 10,
      top: 15,
      zIndex: 1,
    },
    loginButton: {
      backgroundColor: COLORS.primaryDark,
      height: 50,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
      width: '100%',
    },
    loginButtonText: {
      ...FONTS.h3,
      color: COLORS.white,
      fontWeight: 'bold',
      alignItems: 'center',
      justifyContent: 'center',
    },
    touchIdContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    touchIdText: {
      marginTop: 6,
      ...FONTS.body4,
      color: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
    fontWeight: 'bold',
      
    },
    touchIdButton:{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
     
    },
    touchIdIcon: {
      //marginBottom: 4,
      color: COLORS.primaryDark,
    },
    icon: {
      marginLeft: 10, // Add spacing to the left of the icon
      marginRight: 10, // Add spacing to the right of the icon
    
      color: COLORS.primary,// Ensure the color is visible
    },
    forgotPassword:{
      ...FONTS.body3,
      color:COLORS.primaryDark,
      textAlign:'center',
     
      marginTop: 60,
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: 20,
      textDecorationLine: 'underline',
      textDecorationColor: COLORS.primaryDark,
    },
  });

export default LoginScreen;
