import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addPrescription } from '../../redux/slices/patientsSlice'; // Corrected import path
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import { COLORS } from '../../constants/theme';
import { useState } from 'react'; // Import useState

const PatientDetailsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentPatient = useSelector((state) => state.patients.selectedPatient); // Corrected selector
  const [showHeartRateModal, setShowHeartRateModal] = useState(false);
  const [showTemperatureModal, setShowTemperatureModal] = useState(false);
  const [showGlucoseModal, setShowGlucoseModal] = useState(false);

  if (!currentPatient) {
    return (
      <View style={styles.noPatientContainer}>
        <Text style={styles.noPatientText}>No patient selected</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('PatientListScreen')}>
          <Text style={styles.backButtonText}>Go to Patient List</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAddPrescription = () => {
    const newPrescription = {
      id: Date.now(), // Unique ID for the prescription
      medication: 'New Medication',
      date: '12/07/2023',
      duration: '7 days',
    };
    dispatch(addPrescription(newPrescription)); // Dispatch the action to add the prescription
  };

  // Provide default values for testReports and prescriptions if they are undefined
  const testReports = currentPatient.testReports || [];
  const prescriptions = currentPatient.prescriptions || [];

  // Provide a default value for healthMetrics if it's undefined
  const healthMetrics = currentPatient.healthMetrics || {
    heartRate: 120/80,
    //bodyTemperature: 96.5°F,
    bodyTemperature: 96.5,
    glucose: 120,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Navigation */}


      {/* Print & Email Buttons - Above Vital Signs */}
  
      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.backButtons} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#5856D6" />
          <Text style={styles.backButtonsText}>Patient Information</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>

        <View style={styles.profileCard}>
  <Image
    source={
      currentPatient.profileImage
        ? (typeof currentPatient.profileImage === 'string'
            ? { uri: currentPatient.profileImage }
            : currentPatient.profileImage)
        : require('../../Assets/image/profile-image.jpg')
    }
    style={styles.profileCardImage}
  />
  <Text style={styles.profileCardName}>{currentPatient.name}</Text>
  <Text style={styles.profileCardId}>Patient ID: {currentPatient.id}</Text>
  <Text style={styles.profileCardAge}>Age: {currentPatient.age}</Text>
  <View style={styles.profileCardButtonRow}>
    <TouchableOpacity
      style={styles.profileCardButton}
      onPress={() => navigation.navigate('ProfileScreen', { patient: currentPatient })}
    >
      <Text style={styles.profileCardButtonText}>View Profile</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.profileCardButtonOutline}>
      <Text style={styles.profileCardButtonOutlineText}>Edit Profile</Text>
    </TouchableOpacity>
  </View>
</View>
<View style={styles.actionButtonsRow}>
  <TouchableOpacity
    style={[styles.actionButton, styles.printButton]}
    onPress={() => {/* TODO: Implement print functionality */}}
  >
    <Ionicons name="print-outline" size={20} color="#fff" style={styles.actionButtonIcon} />
    <Text style={styles.actionButtonText}>Print Report</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.actionButton, styles.emailButton]}
    onPress={() => {/* TODO: Implement email functionality */}}
  >
    <Ionicons name="send-outline" size={20} color="#fff" style={styles.actionButtonIcon} />
    <Text style={styles.actionButtonText}>Send by Email</Text>
  </TouchableOpacity>
</View>


        <View style={styles.vitalSignsCard}>
  <Text style={styles.vitalSignsTitle}>Vital Signs</Text>
  <View style={styles.vitalSignsRow}>
    <View style={styles.vitalSignItem}>
      <Ionicons name="heart" size={28} color="#e53935" />
      <Text style={[styles.vitalSignValue, { color: '#e53935' }]}>
        {healthMetrics.heartRate || '--'} <Text style={styles.vitalSignUnit}>bpm</Text>
      </Text>
      <Text style={styles.vitalSignLabel}>Heart Rate</Text>
    </View>
    <View style={styles.vitalSignDivider} />
    <View style={styles.vitalSignItem}>
      <Ionicons name="water" size={28} color="#039be5" />
      <Text style={[styles.vitalSignValue, { color: '#039be5' }]}>
        {healthMetrics.oxygen || '99'}<Text style={styles.vitalSignUnit}>%</Text>
      </Text>
      <Text style={styles.vitalSignLabel}>Oxygen</Text>
    </View>
    <View style={styles.vitalSignDivider} />
    <View style={styles.vitalSignItem}>
      <Ionicons name="thermometer" size={28} color="#fb8c00" />
      <Text style={[styles.vitalSignValue, { color: '#fb8c00' }]}>
        {healthMetrics.bodyTemperature || '--'}<Text style={styles.vitalSignUnit}>°F</Text>
      </Text>
      <Text style={styles.vitalSignLabel}>Temperature</Text>
    </View>
    <View style={styles.vitalSignDivider} />
    <View style={styles.vitalSignItem}>
      <Ionicons name="analytics" size={28} color="#43a047" />
      <Text style={[styles.vitalSignValue, { color: '#43a047' }]}>
        {healthMetrics.glucose || '--'}<Text style={styles.vitalSignUnit}>mg/dL</Text>
      </Text>
      <Text style={styles.vitalSignLabel}>Glucose</Text>
    </View>
  </View>
</View>

        {/* Test Reports Section - Modern Card Style */}
        <View style={styles.testReportsSection}>
  <Text style={styles.sectionTitle}>Test Reports</Text>
  <View style={styles.testReportsCardRow}>
    {testReports.length > 0 ? (
      testReports.map((report, idx) => (
        <View key={report.id || idx} style={styles.testReportCard}>
          <Ionicons
            name="document-text-outline"
            size={32}
            color={['#e57373', '#64b5f6', '#9575cd'][idx % 3]}
            style={styles.testReportIcon}
          />
          <Text style={styles.testReportName}>{report.name}</Text>
          <Text style={styles.testReportDate}>{report.date || ''}</Text>
        </View>
      ))
    ) : (
      <Text style={styles.testReportEmpty}>No test reports available</Text>
    )}
  </View>
</View>

<View style={styles.prescriptionsSection}>
  <Text style={styles.sectionTitle}>Prescriptions</Text>
  <View style={styles.prescriptionsCardRow}>
    {prescriptions.length > 0 ? (
      prescriptions.map((prescription, idx) => (
        <View key={prescription.id || idx} style={styles.prescriptionCard}>
          <Text style={styles.prescriptionNameBold}>{prescription.name}</Text>
          <Text style={styles.prescriptionDurationBold}>{prescription.duration}</Text>
          <Text style={styles.prescriptionDateRange}>
            {prescription.startDate} &rarr; {prescription.endDate}
          </Text>
          <View style={styles.prescriptionMedicinesList}>
            {prescription.medicines && prescription.medicines.map((med, idx2) => (
              <Text key={idx2} style={styles.prescriptionMedicine}>
                <Ionicons name="medkit-outline" size={14} color="#1976d2" /> {med}
              </Text>
            ))}
          </View>
        </View>
      ))
    ) : (
      <Text style={styles.prescriptionEmpty}>No prescriptions available</Text>
    )}
  </View>
  <TouchableOpacity
    onPress={handleAddPrescription}
    style={styles.addPrescriptionButtonDashed}
  >
    <Text style={styles.addPrescriptionButtonText}>+ Add a prescription</Text>
  </TouchableOpacity>
</View>

      </ScrollView>

      {/* Heart Rate Modal */}
      <Modal
        visible={showHeartRateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHeartRateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Heart Rate Details</Text>
            <Text style={styles.modalValue}>
              {healthMetrics.heartRate} <Text style={styles.metricUnit}>bpm</Text>
            </Text>
            <Text style={styles.modalDescription}>
              Normal resting heart rate for adults ranges from 60 to 100 bpm.
              If your heart rate is consistently outside this range, consult your doctor.
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowHeartRateModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Body Temperature Modal */}
      <Modal
        visible={showTemperatureModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTemperatureModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Body Temperature Details</Text>
            <Text style={styles.modalValue}>
              {healthMetrics.bodyTemperature} <Text style={styles.metricUnit}>°F</Text>
            </Text>
            <Text style={styles.modalDescription}>
              Normal body temperature for adults is about 97°F to 99°F (36.1°C to 37.2°C).
              If your temperature is outside this range, consult your doctor.
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowTemperatureModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Glucose Modal */}
      <Modal
        visible={showGlucoseModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGlucoseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Glucose Details</Text>
            <Text style={styles.modalValue}>
              {healthMetrics.glucose} <Text style={styles.metricUnit}>mg/dL</Text>
            </Text>
            <Text style={styles.modalDescription}>
              Normal fasting blood glucose is 70–99 mg/dL.
              If your glucose level is outside this range, consult your doctor.
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowGlucoseModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

   </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  noPatientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noPatientText: {
    fontSize: 18,
    color: '#757575',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#4a3aa9',
    borderRadius: 4,
    padding: 12,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
    top: 30,
   // bottom: 20,
    //marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    marginHorizontal: 16,
  },
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  patientInfo: {
    flexDirection: 'row',
  },
  profileSection: {
    alignItems: 'center',
    marginRight: 16,
  },
  profileImage: {
    width: 100, // Adjust the size as needed
    height: 100,
    borderRadius: 50, // Makes the image circular
    borderWidth: 2,
    borderColor: '#6C63FF', // Optional border color
    marginBottom: 8,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  patientAge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detailsSection: {
    flex: 1,
  },
  infoHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6a5acd',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    width: 90,
    fontSize: 16,
    fontWeight: 'semibold',
    color: '#030129'
  },
  infoValue: {
    fontSize: 16,
    color: '#46444d',
    //fontWeight: "500",
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricTitle: {
    fontSize: 14,
    color: 'rgb(108, 95, 231)',
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  metricTitle1: {
    fontSize: 14,
    color: 'rgb(108, 95, 231)',
   //ottom: 0,
    top:30,
    //marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  metricValue1: {
    fontSize: 16,
    fontWeight: 'normal',
    marginTop: 30,
    color: 'rgb(3, 14, 29)',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'normal',
    marginTop: 0,
  },
  reportsSection: {
    marginVertical: 12,
  },
  reportsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  goToBrainTestButton: {
    backgroundColor: '#5856D6',
    borderRadius: 16,
    paddingVertical: 18, // Increased padding for height
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    width: '80%', // Make it full width
    alignSelf: 'center', // Center the button
    elevation: 2,
  },
  goToBrainTestButtonText: {
    color: '#fff',
    fontSize: 18, // Larger font
    fontWeight: 'bold',
    letterSpacing: 0.5,

  },
  reportItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  reportName: {
    fontSize: 12,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginTop: 8,
  },
  prescriptionsSection: {
    marginVertical: 12,
  },
  addPrescriptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  addPrescriptionText: {
    color: 'rgb(2, 73, 58)',
    marginLeft: 4,
    fontSize: 14,
  },
  prescriptionsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  prescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  prescriptionHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  prescriptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  prescriptionNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  prescriptionIcon: {
    marginRight: 8,
  },
  prescriptionName: {
    fontSize: 14,
    fontWeight: '500',
  },
  prescriptionDate: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  prescriptionDuration: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0' ,
    marginHorizontal: 12,
  },
  button: {
    backgroundColor: '#6C63FF',
    padding: 26,
    width: '80%',
    marginLeft: '10%',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    top:30,
    right: 10,
   },
  backButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonsText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#5856D6',
    paddingLeft: 8,
    //marginLeft: 4,
  },
  metricIcon: {
    //marginRight: 8,
    position: 'absolute',
    //width:'200%',
    //height:'200%',
    
    
  },
 
  metricIconContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  bottom:20,
  top:10,
   
    
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 12,
  },
  modalValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#5856D6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  profileCardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#dbdbe7',
  },
  profileCardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 2,
    textAlign: 'center',
  },
  profileCardId: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
    textAlign: 'center',
  },
  profileCardAge: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  profileCardButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 8,
    gap: 10,
  },
  profileCardButton: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 4,
  },
  profileCardButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  profileCardButtonOutline: {
    borderWidth: 2,
    borderColor: COLORS.primaryDark,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 4,
    backgroundColor: '#fff',
  },
  profileCardButtonOutlineText: {
    color: COLORS.primaryDark,
    fontWeight: 'bold',
    fontSize: 15,
  },

  infoSection: {
    backgroundColor: '#fff' ,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoHeaderBig: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
    textAlign: 'left',
  },
  // infoRow: {
  //   flexDirection: "row",
  //   marginBottom: 8,
  //   alignItems: "flex-start",
  // },
  infoLabelBold: {
    fontWeight: 'bold',
    color: '#111',
    fontSize: 15,
    minWidth: 100,
  },
  infoValueBlack: {
    color: '#222',
    fontSize: 15,
    flexShrink: 1,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 0,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  printButton: {
    backgroundColor: '#0ea5e9',
    shadowColor: '#0ea5e9',
    marginRight: 4,
  },
  emailButton: {
    backgroundColor: '#38bdf8',
    shadowColor: '#38bdf8',
    marginLeft: 4,
  },
  actionButtonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  vitalSignsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  vitalSignsTitle: {
    fontWeight: 'bold',
    color: '#1976d2',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  vitalSignsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vitalSignItem: {
    flex: 1,
    alignItems: 'center',
  },
  vitalSignValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 2,
  },
  vitalSignUnit: {
    fontSize: 12,
    color: '#888',
  },
  vitalSignLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  vitalSignDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 6,
  },
  prescriptionMedicine: {
    fontSize: 12,
    color: '#222',
    marginBottom: 1
  },
  prescriptionEmpty: {
    color: '#888',
    fontSize: 15
  },
  // addPrescriptionButton: {
  //   borderWidth: 1.5,
  //   borderStyle: 'dashed',
  //   borderColor: '#009688',
  //   borderRadius: 10,
  //   paddingVertical: 18,
  //   marginTop: 18,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: '#fff'
  // },
  addPrescriptionButtonText: {
    color: '#009688',
    fontWeight: 'bold',
    fontSize: 15
  },
  testReportsSection: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#fafbfc',
    borderRadius: 12,
    padding: 10,
  },
  testReportsCardRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  testReportCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    width: 140,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  testReportIcon: {
    marginBottom: 8,
  },
  testReportName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    textAlign: 'center',
  },
  testReportDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textAlign: 'center',
  },
  
  
  prescriptionsCardRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  prescriptionCard: {
    backgroundColor: '#e6fafd',
    borderRadius: 10,
    padding: 16,
    width: 180,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  prescriptionNameBold: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1976d2',
    marginBottom: 2,
    textAlign: 'center',
  },
  prescriptionDurationBold: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222',
    marginBottom: 2,
    textAlign: 'center',
  },
  prescriptionDateRange: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
    textAlign: 'center',
  },
  prescriptionMedicinesList: {
    marginTop: 4,
  },
  // prescriptionMedicine: {
  //   fontSize: 12,
  //   color: '#222',
  //   marginBottom: 1,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  addPrescriptionButtonDashed: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#009688',
    borderRadius: 10,
    paddingVertical: 18,
    marginTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  // addPrescriptionButtonText: {
  //   color: '#009688',
  //   fontWeight: 'bold',
  //   fontSize: 15,
  // },
});

export default PatientDetailsScreen;

