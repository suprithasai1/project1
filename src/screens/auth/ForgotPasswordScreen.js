"use client"

// Screen for entering email to start password reset
import React, { useState } from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  SafeAreaView,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import sendOTPEmail from "../../sevices/sendOTPEmail"

const STATIC_EMAIL = "konduru075@gmail.com"
const STATIC_OTP = "123456"
const { width, height } = Dimensions.get("window")

const ForgotPasswordScreen = () => {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = async () => {
    setIsLoading(true)
    try {
      // Send OTP to email using EmailJS
      sendOTPEmail(STATIC_EMAIL, STATIC_OTP)
      // Optionally, you can wait for the promise to resolve before navigating
      setTimeout(() => {
        setIsLoading(false)
        navigation.navigate("VerificationScreen", { email: STATIC_EMAIL, otp: STATIC_OTP })
      }, 1000)
    } catch (error) {
      setIsLoading(false)
      Alert.alert("Error", error.message || "Failed to send OTP")
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FB" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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

        {/* Card */}
        <View style={styles.centeredContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>Forgot password</Text>
            <Text style={styles.subtitle}>Enter your email address to receive an OTP</Text>

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={STATIC_EMAIL}
              editable={false}
              placeholderTextColor="#A0A0A0"
            />

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleNext}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>{isLoading ? "Sending..." : "Next"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
  },
  container: {
    backgroundColor: '#F5F5F5',
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
  centeredContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: height * 0.3, // Move card upward
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    elevation: 6,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5C4DFF",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 22,
  },
  label: {
    color: "#5C4DFF",
    fontWeight: "500",
    marginBottom: 8,
    alignSelf: "flex-start",
    marginLeft: 2,
  },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#F5F5F5",
    color: "#222",
    marginBottom: 18,
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: "#6C63FF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    elevation: 2,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
  },
  buttonDisabled: {
    backgroundColor: "#A5A1E5",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default ForgotPasswordScreen
