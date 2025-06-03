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
  hippocampusVolume: { min: 2.5, max: 4.5, placeholder: '2.5 - 4.5', label: 'Hippocampus Volume (cm³)' },
  corticalThickness: { min: 2.0, max: 3.5, placeholder: '2.0 - 3.5', label: 'Cortical Thickness (mm)' },
  ventricleVolume: { min: 15, max: 40, placeholder: '15 - 40', label: 'Ventricle Volume (cm³)' },
  whiteMatters: { min: 0, max: 10, placeholder: '0 - 10', label: 'White Matter Hyperintensities' },
  brainGlucose: { min: 4.0, max: 7.0, placeholder: '4.0 - 7.0', label: 'Brain Glucose Metabolism (SUV)' },
  amyloidDeposition: { min: 0, max: 2.5, placeholder: '0 - 2.5', label: 'Amyloid Deposition (SUVR)' },
  tauProteinLevel: { min: 0.8, max: 2.0, placeholder: '0.8 - 2.0', label: 'Tau Protein Level (SUVR)' },
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
  const [inputWarnings, setInputWarnings] = useState({
    hippocampusVolume: false,
    corticalThickness: false,
    ventricleVolume: false,
    whiteMatters: false,
    brainGlucose: false,
    amyloidDeposition: false,
    tauProteinLevel: false,
  });
  const [inputErrors, setInputErrors] = useState({});

  // Unified input handler (Parkinson's style)
  const handleInputChange = (key, value) => {
    let filtered = value.replace(/[^0-9.]/g, '');
    if ((filtered.match(/\./g) || []).length > 1) {
      filtered = filtered.slice(0, -1);
    }
    // Check for invalid characters
    if (value !== filtered) {
      setInputWarnings({ ...inputWarnings, [key]: 'Only allowed numeric values.' });
      setInputs({ ...inputs, [key]: filtered });
      setInputErrors({ ...inputErrors, [key]: '' });
      return;
    }
    // Check for out-of-range values
    if (filtered && (parseFloat(filtered) < ranges[key].min || parseFloat(filtered) > ranges[key].max)) {
      setInputWarnings({ ...inputWarnings, [key]: `Value must be between ${ranges[key].min} and ${ranges[key].max}.` });
    } else {
      setInputWarnings({ ...inputWarnings, [key]: false });
    }
    setInputs({ ...inputs, [key]: filtered });
    setInputErrors({ ...inputErrors, [key]: '' });
  };

  // Validation (Parkinson's style)
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

        {/* Form Section (Parkinson's style) */}
        <View style={styles.formContainer}>
          {/* MRI-derived Structural Features */}
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>MRI-derived Structural Features :</Text>
            {['hippocampusVolume', 'corticalThickness', 'ventricleVolume', 'whiteMatters'].map(key => (
              <View style={styles.resultRow} key={key}>
                <Text style={styles.resultLabel}>{ranges[key].label}</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, { textAlign: 'center', color: '#5856D6' }]}
                    keyboardType="numeric"
                    placeholder={ranges[key].placeholder}
                    placeholderTextColor="#999"
                    maxLength={6}
                    value={inputs[key]}
                    onChangeText={v => handleInputChange(key, v)}
                  />
                  {inputWarnings[key] && (
                    <Text style={styles.inputError}>{inputWarnings[key]}</Text>
                  )}
                  {inputErrors[key] && (
                    <Text style={styles.inputError}>{inputErrors[key]}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
          {/* Functional and Molecular Biomarkers */}
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>Functional and Molecular Biomarkers :</Text>
            {['brainGlucose', 'amyloidDeposition', 'tauProteinLevel'].map(key => (
              <View style={styles.resultRow} key={key}>
                <Text style={styles.resultLabel}>{ranges[key].label}</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, { textAlign: 'center', color: '#5856D6' }]}
                    keyboardType="numeric"
                    placeholder={ranges[key].placeholder}
                    placeholderTextColor="#999"
                    maxLength={6}
                    value={inputs[key]}
                    onChangeText={v => handleInputChange(key, v)}
                  />
                  {inputWarnings[key] && (
                    <Text style={styles.inputError}>{inputWarnings[key]}</Text>
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

        {/* Results Section ... (unchanged) */}
        {/* ...existing result rendering code... */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 10,
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
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 2,
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
    alignItems: 'flex-start',
    justifyContent: 'center',
    minWidth: 120,
    maxWidth: 140,
  },
  inputError: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
    justifyContent: 'center',
    // Uncomment if you want to set a minimum height for the error text
    // minWidth: 120,
    // minHeight: 16,
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
