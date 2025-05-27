import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

const { width } = Dimensions.get("window")

const SuccessScreen = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>New Password Confirmed Successfully</Text>
        <View style={styles.successIconContainer}>
          <View style={styles.successCircle}>
            <Icon name="checkmark" size={40} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.message}>
          You have successfully confirmed your new password. You can now login with your new password.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6C63FF",
    marginBottom: 24,
    textAlign: "center",
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  button: {
    width: "100%",
    height: 50,
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
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default SuccessScreen
