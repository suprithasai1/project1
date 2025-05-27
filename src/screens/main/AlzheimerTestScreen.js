import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { setRiskPercentage, setLoading, setError } from '../../redux/slices/alzheimerSlice';
import AlzheimerModelService from '../../api/alzheimerModelService';

const ranges = {
  hippocampusVolume: { min: 2.5, max: 4.5, placeholder: '2.5 - 4.5' },
  corticalThickness: { min: 2.0, max: 3.5, placeholder: '2.0 - 3.5' },
  ventricleVolume: { min: 15, max: 40, placeholder: '15 - 40' },
  whiteMatters: { min: 0, max: 10, placeholder: '0 - 10' },
  brainGlucose: { min: 4.0, max: 7.0, placeholder: '4.0 - 7.0' },
  amyloidDeposition: { min: 0, max: 2.5, placeholder: '0 - 2.5' },
  tauProteinLevel: { min: 0.8, max: 2.0, placeholder: '0.8 - 2.0' },
};

const AlzheimerTestScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { riskPercentage, isLoading, error } = useSelector((state) => state.alzheimer);
  const [showResult, setShowResult] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  const [inputs, setInputs] = useState({
    hippocampusVolume: '',
    corticalThickness: '',
    ventricleVolume: '',
    whiteMatters: '',
    brainGlucose: '',
    amyloidDeposition: '',
    tauProteinLevel: '',
  });
  const [inputErrors, setInputErrors] = useState({});
  const [inputWarnings, setInputWarnings] = useState({
    hippocampusVolume: false,
    corticalThickness: false,
    ventricleVolume: false,
    whiteMatters: false,
    brainGlucose: false,
    amyloidDeposition: false,
    tauProteinLevel: false,
  });

  // Input handler: only numbers and one dot
  const handleInputChange = (key, value) => {
    let filtered = value.replace(/[^0-9.]/g, '');
    if ((filtered.match(/\./g) || []).length > 1) {
      filtered = filtered.slice(0, -1);
    }
    setInputs({ ...inputs, [key]: filtered });
    setInputErrors({ ...inputErrors, [key]: '' });
    setInputWarnings({ ...inputWarnings, [key]: value !== filtered });
  };

  // Validation
  const validateInputs = () => {
    let valid = true;
    let errors = {};
    Object.keys(ranges).forEach((key) => {
      const val = parseFloat(inputs[key]);
      if (!inputs[key]) {
        errors[key] = 'This field is required.';
        valid = false;
      } else if (isNaN(val) || val < ranges[key].min || val > ranges[key].max) {
        errors[key] = `Enter a value between ${ranges[key].min} and ${ranges[key].max}`;
        valid = false;
      }
    });
    setInputErrors(errors);
    return valid;
  };

  // Submit handler
  const handleShowResult = async () => {
    if (!validateInputs()) return;
    try {
      dispatch(setLoading(true));
      setShowResult(true);
      const manualFeatures = {
        hippocampus_volume: parseFloat(inputs.hippocampusVolume),
        cortical_thickness: parseFloat(inputs.corticalThickness),
        ventricle_volume: parseFloat(inputs.ventricleVolume),
        white_matter_hyperintensities: parseFloat(inputs.whiteMatters),
        brain_glucose_metabolism: parseFloat(inputs.brainGlucose),
        amyloid_deposition: parseFloat(inputs.amyloidDeposition),
        tau_protein_level: parseFloat(inputs.tauProteinLevel)
      };
      const result = await AlzheimerModelService.predictRisk(manualFeatures);
      dispatch(setRiskPercentage(parseFloat(result.riskPercentage)));
      setPredictionResult(result);
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError('Failed to get prediction from model. Please try again.'));
      Alert.alert('Error', 'Failed to get prediction from model');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.navigationBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#5856D6" />
            <Text style={styles.backButtonText}>Alzheimer Test</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => Alert.alert('Info', 'File upload not implemented in this demo.')}
          >
            <Ionicons name="cloud-upload" size={16} color="#5856D6" />
            <Text style={styles.uploadButtonText}>Upload Reports</Text>
          </TouchableOpacity>
        </View>

        {/* Card Form */}
        <View style={styles.formContainer}>
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>MRI-derived Structural Features :</Text>
            {[
              { key: 'hippocampusVolume', label: 'Hippocampus Volume (cm³)' },
              { key: 'corticalThickness', label: 'Cortical Thickness (mm)' },
              { key: 'ventricleVolume', label: 'Ventricle Volume (cm³)' },
              { key: 'whiteMatters', label: 'White Matter Hyperintensities' },
            ].map(({ key, label }) => (
              <View style={styles.resultRow} key={key}>
                <Text style={styles.resultLabel}>{label}</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, { color: '#5856D6' }]}
                    keyboardType="numeric"
                    value={inputs[key]}
                    onChangeText={v => handleInputChange(key, v)}
                    placeholder={ranges[key].placeholder}
                    placeholderTextColor="#999"
                    maxLength={6}
                  />
                  {inputWarnings[key] && (
                    <Text style={styles.inputError}>Only numbers and a single dot are allowed.</Text>
                  )}
                  {inputErrors[key] && (
                    <Text style={styles.inputError}>{inputErrors[key]}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>Functional and Molecular Biomarkers :</Text>
            {[
              { key: 'brainGlucose', label: 'Brain Glucose Metabolism (SUV)' },
              { key: 'amyloidDeposition', label: 'Amyloid Deposition (SUVR)' },
              { key: 'tauProteinLevel', label: 'Tau Protein Level (SUVR)' },
            ].map(({ key, label }) => (
              <View style={styles.resultRow} key={key}>
                <Text style={styles.resultLabel}>{label}</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, { color: '#5856D6' }]}
                    keyboardType="numeric"
                    value={inputs[key]}
                    onChangeText={v => handleInputChange(key, v)}
                    placeholder={ranges[key].placeholder}
                    placeholderTextColor="#999"
                    maxLength={6}
                  />
                  {inputWarnings[key] && (
                    <Text style={styles.inputError}>Only numbers and a single dot are allowed.</Text>
                  )}
                  {inputErrors[key] && (
                    <Text style={styles.inputError}>{inputErrors[key]}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton} onPress={handleShowResult}>
          <Text style={styles.actionButtonText}>Calculate Risk</Text>
        </TouchableOpacity>

        {/* Results */}
        {showResult && !isLoading && predictionResult && (
          <>
            <View
              style={[
                styles.resultCard,
                {
                  borderColor: predictionResult.riskPercentage > 50 ? '#ff4d4f' : '#52c41a',
                  backgroundColor: predictionResult.riskPercentage > 50 ? '#fff1f0' : '#f6ffed',
                },
              ]}
            >
              <Text
                style={[
                  styles.resultCardTitle,
                  { color: predictionResult.riskPercentage > 50 ? '#ff4d4f' : '#52c41a' },
                ]}
              >
                {predictionResult.riskPercentage > 50
                  ? `High Risk: ${predictionResult.riskPercentage}%`
                  : `Safe:  ${predictionResult.riskPercentage}%`
                }
              </Text>
              <Text style={styles.resultCardText}>
                Risk Percentage: {predictionResult.riskPercentage}%
              </Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Risk Level:</Text>
                <Text style={[styles.detailValue, { color: predictionResult.riskPercentage > 50 ? '#ff4d4f' : '#52c41a' }]}>
                  {predictionResult.riskPercentage > 50 ? 'High' : 'Low'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Confidence:</Text>
                <Text style={styles.detailValue}>
                  {(predictionResult.confidence * 100).toFixed(0)}%
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Assessment Date:</Text>
                <Text style={styles.detailValue}>
                  {new Date().toLocaleDateString()}
                </Text>
              </View>
              {predictionResult.riskPercentage <= 50 && (
                <View style={styles.safeContainer}>
                  <Text style={styles.safeText}>
                    The patient is safe. No immediate action is required.
                  </Text>
                </View>
              )}
              <Text style={styles.resultNote}>
                Note: This assessment is based on the provided MRI features and should be confirmed by a healthcare professional.
              </Text>
            </View>
            {predictionResult.riskPercentage > 50 && (
              <View style={styles.precautionsCard}>
                <Text style={styles.precautionsTitle}>Precautions:</Text>
                <Text style={styles.precautionsText}>• Regular cognitive assessments are recommended</Text>
                <Text style={styles.precautionsText}>• Consider lifestyle modifications to slow progression</Text>
                <Text style={styles.precautionsText}>• Consult with a neurologist for a comprehensive evaluation</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
    top: 60,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  backButtonText: {
    marginLeft: 4,
    color: '#5856D6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5856D6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 5,
  },
  uploadButtonText: {
    color: '#5856D6',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 6,
    marginTop: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  testSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5856D6',
    marginBottom: 8,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  resultLabel: {
    flex: 1,
    fontSize: 14,
    color: 'rgb(77, 79, 95)',
    fontWeight: '600',
  },
  input: {
    width: 120,
    height: 40,
    borderWidth: 1.2,
    borderColor: 'rgb(156, 151, 199)',
    paddingHorizontal: 12,
    borderRadius: 8,
    textAlign: 'center',
    color: '#5856D6', // Parkinson's blue for input text
    backgroundColor: '#FAFAFA',
    fontSize: 16,
    fontWeight: '500',
  },
  inputWrapper: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 120,
    maxWidth: 140,
  },
  inputError: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'right',
    minHeight: 16,
  },
  actionButton: {
    backgroundColor: '#5856D6',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    margin: 16,
    marginTop: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 0,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  resultCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultCardText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  safeContainer: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#F5FFF5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'green',
  },
  safeText: {
    fontSize: 14,
    color: 'green',
  },
  precautionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgb(202, 213, 236)',
    padding: 16,
    marginHorizontal: 0,
    marginBottom: 24,
    shadowColor: 'rgb(200, 214, 245)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  precautionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(18, 89, 196)',
    marginBottom: 8,
  },
  precautionsText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgb(40, 61, 92)',
    marginBottom: 4,
  },
});

export default AlzheimerTestScreen;
