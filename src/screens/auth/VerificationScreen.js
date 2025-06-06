// "use client"

// // Screen for OTP verification
// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
// import { useNavigation, useRoute } from "@react-navigation/native";

// const VerificationScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { email, otp: expectedOtp } = route.params || {}; // get static OTP from params

//   const [otp, setOtp] = useState("");

//   const handleVerify = () => {
//     if (otp === expectedOtp) {
//       Alert.alert("Success", "OTP verified!");
//       navigation.navigate("ResetPassword", { email });
//     } else {
//       Alert.alert("Error", "Invalid OTP. Please try again.");
//     }
//   };

//   const handleResend = () => {
//     Alert.alert("OTP Sent", `OTP sent to ${email}: ${expectedOtp}`);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Verification Required</Text>
//       <Text style={styles.subtitle}>
//         A message with a verification code has been sent to your email
//       </Text>
//       <View style={styles.otpContainer}>
//         <TextInput
//           style={styles.otpInput}
//           value={otp}
//           onChangeText={setOtp}
//           keyboardType="numeric"
//           maxLength={6}
//           placeholder="Enter OTP"
//           placeholderTextColor="#A0A0A0"
//         />
//       </View>
//       <TouchableOpacity onPress={handleResend}>
//         <Text style={styles.resendText}>Resend code</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.button} onPress={handleVerify}>
//         <Text style={styles.buttonText}>Verify</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
//   title: { fontSize: 22, fontWeight: "bold", color: "#5C4DFF", textAlign: "center", marginBottom: 12 },
//   subtitle: { color: "#888", textAlign: "center", marginBottom: 24 },
//   otpContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 16 },
//   otpInput: {
//     borderWidth: 1,
//     borderColor: "#E0E0E0",
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     fontSize: 20,
//     backgroundColor: "#F5F5F5",
//     color: "#222",
//     textAlign: "center",
//     width: 160,
//     height: 48,
//   },
//   resendText: { color: "#5C4DFF", textAlign: "center", marginBottom: 24, marginTop: 8, fontWeight: "500" },
//   button: {
//     width: "100%",
//     height: 48,
//     backgroundColor: "#6C63FF",
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 8,
//   },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
// });

// export default VerificationScreen;
