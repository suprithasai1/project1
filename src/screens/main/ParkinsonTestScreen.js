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
  ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { updateTestResults, setLoading, setError } from '../../redux/slices/parkinsonTestSlice';
import { COLORS } from '../../constants/theme';
import ParkinsonModelService from '../../api/parkinsonModelService';
 
const ParkinsonTestScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // Get test results from Redux store
  const { testResults, isLoading, error } = useSelector((state) => state.parkinsonTest);
 
  // Local state for form values
  const [datScanValues, setDatScanValues] = useState({
    caudateR: '',
    caudateL: '',
    putamenR: '',
    putamenL: '',
  });
 
  const [updrsValue, setUpdrsValue] = useState('');
  const [smellTestValue, setSmellTestValue] = useState('');
  const [cognitiveValue, setCognitiveValue] = useState('');
  const [calculatedResults, setCalculatedResults] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
 
  // Add inputWarnings state
  const [inputWarnings, setInputWarnings] = useState({
    caudateR: false,
    caudateL: false,
    putamenR: false,
    putamenL: false,
    updrs: false,
    smell: false,
    cognitive: false,
  });
 
  // Handle file upload (stub)
  const handleUploadReports = async () => {
    try {
      // Implement file picker logic here if needed
      Alert.alert('Info', 'File upload not implemented in this demo.');
    } catch (err) {
      Alert.alert('Error', 'Failed to upload file.');
    }
  };
 
  // Save test results to Redux store (stub)
  const saveTestResults = () => {
    const results = {
      datScan: {
        caudateR: parseFloat(datScanValues.caudateR) || 0,
        caudateL: parseFloat(datScanValues.caudateL) || 0,
        putamenR: parseFloat(datScanValues.putamenR) || 0,
        putamenL: parseFloat(datScanValues.putamenL) || 0,
      },
      updrs: { npdtot: updrsValue },
      smellTest: { upsitPercentage: smellTestValue },
      cognitive: { cogchq: cognitiveValue },
    };
    // dispatch(updateTestResults(results));
    // Alert.alert('Success', 'Test results saved successfully');
  };
 
  // Calculate and display results
  const viewTestResults = async () => {
    // Check if all fields are filled
    const allFieldsFilled =
      datScanValues.caudateR.trim() !== '' &&
      datScanValues.caudateL.trim() !== '' &&
      datScanValues.putamenR.trim() !== '' &&
      datScanValues.putamenL.trim() !== '' &&
      updrsValue.trim() !== '' &&
      smellTestValue.trim() !== '' &&
      cognitiveValue.trim() !== '';
 
    if (!allFieldsFilled) {
      setCalculatedResults(null);
      Alert.alert('Incomplete', 'Please fill in all test fields to view the result.');
      return;
    }
 
    saveTestResults();
 
    try {
      dispatch(setLoading(true));
     
      // Prepare data for the API request
      const testData = {
        datScan: {
          caudateR: parseFloat(datScanValues.caudateR),
          caudateL: parseFloat(datScanValues.caudateL),
          putamenR: parseFloat(datScanValues.putamenR),
          putamenL: parseFloat(datScanValues.putamenL)
        },
        updrs: {
          npdtot: parseFloat(updrsValue)
        },
        smellTest: {
          upsitPercentage: parseFloat(smellTestValue)
        },
        cognitive: {
          cogchq: parseFloat(cognitiveValue)
        }
      };
     
      // Send data to the backend and get prediction
      const result = await ParkinsonModelService.predictRisk(testData);
      setPredictionResult(result);
     
      // Also set calculated results for backward compatibility
      setCalculatedResults({
        datScanSum: ((parseFloat(datScanValues.caudateR) || 0) +
                    (parseFloat(datScanValues.caudateL) || 0) +
                    (parseFloat(datScanValues.putamenR) || 0) +
                    (parseFloat(datScanValues.putamenL) || 0)).toFixed(2),
        totalSum: 0,
        average: 0,
        percentage: result.riskPercentage
      });
     
      dispatch(setError(null));
    } catch (error) {
      console.error('Error predicting Parkinson\'s risk:', error);
      dispatch(setError('Failed to get prediction from model. Please try again.'));
      Alert.alert('Error', 'Failed to get prediction from model');
     
      // Fallback to local calculation if API fails
      const datScanSum =
        (parseFloat(datScanValues.caudateR) || 0) +
        (parseFloat(datScanValues.caudateL) || 0) +
        (parseFloat(datScanValues.putamenR) || 0) +
        (parseFloat(datScanValues.putamenL) || 0);
 
      const totalTests = 4 + 1 + 1 + 1; // 4 DAT Scan + 1 UPDRS + 1 Smell Test + 1 Cognitive
      const totalSum =
        datScanSum +
        (parseFloat(updrsValue) || 0) +
        (parseFloat(smellTestValue) || 0) +
        (parseFloat(cognitiveValue) || 0);
      const average = totalSum / totalTests;
 
      // Calculate percentage
      const maxPossibleScore = 100; // Assuming 100 is the maximum possible score for each test
      const percentage = (totalSum / (totalTests * maxPossibleScore)) * 100;
 
      setCalculatedResults({
        datScanSum: datScanSum.toFixed(2),
        totalSum: totalSum.toFixed(2),
        average: average.toFixed(2),
        percentage: percentage.toFixed(2),
      });
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
        scrollEnabled={true}
        pointerEvents="auto"
      >
        {/* Header */}
        <View style={styles.navigationBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#5856D6" />
            <Text style={styles.backButtonText}>Parkinson Test</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadReports}>
            <Ionicons name="cloud-upload" size={16} color="#5856D6" />
            {/* <Icon name="add" size={16} color="#5856D6" /> */}
            <Text style={styles.uploadButtonText}>Upload Reports</Text>
          </TouchableOpacity>
        </View>
 
        {/* Test Results Form */}
        <View style={styles.formContainer}>
          {/* DAT Scan Test */}
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>DAT Scan Test :</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Caudate-R</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { textAlign: 'center' }]}
                  keyboardType="numeric"
                  placeholder='0-5.5'
                  placeholderTextColor={'#999'}
                  maxLength={6}
                  value={datScanValues.caudateR}
                  onChangeText={(text) => {
                    if (/[^0-9.]/.test(text)) {
                      setInputWarnings(w => ({ ...w, caudateR: 'Only allow numeric values' }));
                      return;
                    }
                    let filtered = text;
                    if ((filtered.match(/\./g) || []).length > 1) {
                      filtered = filtered.slice(0, -1);
                    }
                    if (filtered && parseFloat(filtered) > 5.5) {
                      setInputWarnings(w => ({ ...w, caudateR: 'Value must be 0 to 5.5.' }));
                    } else {
                      setDatScanValues({ ...datScanValues, caudateR: filtered });
                      setInputWarnings(w => ({ ...w, caudateR: false }));
                    }
                  }}
                />
                {inputWarnings.caudateR && (
                  <Text style={styles.inputError}>{inputWarnings.caudateR}</Text>
                )}
              </View>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Caudate-L</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { textAlign: 'center' }]}
                  placeholder='0-5.5'
                  placeholderTextColor={'#999'}
                  maxLength={6}
                  keyboardType="numeric"
                  value={datScanValues.caudateL}
                  onChangeText={(text) => {
                    if (/[^0-9.]/.test(text)) {
                      setInputWarnings(w => ({ ...w, caudateL: 'Only allow numeric values.' }));
                      return;
                    }
                    let filtered = text;
                    if ((filtered.match(/\./g) || []).length > 1) {
                      filtered = filtered.slice(0, -1);
                    }
                    if (filtered && parseFloat(filtered) > 5.5) {
                      setInputWarnings(w => ({ ...w, caudateL: 'Value must be 0 to 5.5.' }));
                    } else {
                      setDatScanValues({ ...datScanValues, caudateL: filtered });
                      setInputWarnings(w => ({ ...w, caudateL: false }));
                    }
                  }}
                />
                {inputWarnings.caudateL && (
                  <Text style={styles.inputError}>{inputWarnings.caudateL}</Text>
                )}
              </View>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Putamen-R</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { textAlign: 'center' }]}
                  placeholder='0-5.5'
                  placeholderTextColor={'#999'}
                  maxLength={6}
                  keyboardType="numeric"
                  value={datScanValues.putamenR}
                  onChangeText={(text) => {
                    if (/[^0-9.]/.test(text)) {
                      setInputWarnings(w => ({ ...w, putamenR: 'Only allow numeric values.' }));
                      return;
                    }
                    let filtered = text;
                    if ((filtered.match(/\./g) || []).length > 1) {
                      filtered = filtered.slice(0, -1);
                    }
                    if (filtered && parseFloat(filtered) > 5.5) {
                      setInputWarnings(w => ({ ...w, putamenR: 'Value must be 0 to 5.5.' }));
                    } else {
                      setDatScanValues({ ...datScanValues, putamenR: filtered });
                      setInputWarnings(w => ({ ...w, putamenR: false }));
                    }
                  }}
                />
                {inputWarnings.putamenR && (
                  <Text style={styles.inputError}>{inputWarnings.putamenR}</Text>
                )}
              </View>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Putamen-L</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { textAlign: 'center' }]}
                  placeholder='0-5.5'
                  placeholderTextColor={'#999'}
                  maxLength={6}
                  keyboardType="numeric"
                  value={datScanValues.putamenL}
                  onChangeText={(text) => {
                    if (/[^0-9.]/.test(text)) {
                      setInputWarnings(w => ({ ...w, putamenL: 'Only allow numeric values.' }));
                      return;
                    }
                    let filtered = text;
                    if ((filtered.match(/\./g) || []).length > 1) {
                      filtered = filtered.slice(0, -1);
                    }
                    if (filtered && parseFloat(filtered) > 5.5) {
                      setInputWarnings(w => ({ ...w, putamenL: 'Value must be 0 to 5.5.' }));
                    } else {
                      setDatScanValues({ ...datScanValues, putamenL: filtered });
                      setInputWarnings(w => ({ ...w, putamenL: false }));
                    }
                  }}
                />
                {inputWarnings.putamenL && (
                  <Text style={styles.inputError}>{inputWarnings.putamenL}</Text>
                )}
              </View>
            </View>
          </View>
 
          {/* UPDRS Test Results */}
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>UPDRS Test Results :</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>NPDTOT</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { textAlign: 'center' }]}
                  keyboardType="numeric"
                  placeholder='0-40'
                  placeholderTextColor={'#999'}
                  maxLength={6}
                  value={updrsValue}
                  onChangeText={(text) => {
                    if (/[^0-9.]/.test(text)) {
                      setInputWarnings(w => ({ ...w, updrs: 'Only allow numeric values.' }));
                      return;
                    }
                    let filtered = text;
                    if ((filtered.match(/\./g) || []).length > 1) {
                      filtered = filtered.slice(0, -1);
                    }
                    if (filtered && parseFloat(filtered) > 40) {
                      setInputWarnings(w => ({ ...w, updrs: 'Value must be 0 to 40.' }));
                    } else {
                      setUpdrsValue(filtered);
                      setInputWarnings(w => ({ ...w, updrs: false }));
                    }
                  }}
                />
                {inputWarnings.updrs && (
                  <Text style={styles.inputError}>{inputWarnings.updrs}</Text>
                )}
              </View>
            </View>
          </View>
 
          {/* Smell Test */}
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>Smell Test :</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>UPSIT Percentage</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { textAlign: 'center' }]}
                  keyboardType="numeric"
                  placeholder='0-40'
                  placeholderTextColor={'#999'}
                  maxLength={6}
                  value={smellTestValue}
                  onChangeText={(text) => {
                    if (/[^0-9.]/.test(text)) {
                      setInputWarnings(w => ({ ...w, smell: 'Only allow numeric values' }));
                      return;
                    }
                    let filtered = text;
                    if ((filtered.match(/\./g) || []).length > 1) {
                      filtered = filtered.slice(0, -1);
                    }
                    if (filtered && parseFloat(filtered) > 40) {
                      setInputWarnings(w => ({ ...w, smell: 'Value must be 0 to 40.' }));
                    } else {
                      setSmellTestValue(filtered);
                      setInputWarnings(w => ({ ...w, smell: false }));
                    }
                  }}
                />
                {inputWarnings.smell && (
                  <Text style={styles.inputError}>{inputWarnings.smell}</Text>
                )}
              </View>
            </View>
          </View>
 
          {/* Cognitive Assessment */}
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>Cognitive Assessment :</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>COGCHQ</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { textAlign: 'center' }]}
                  keyboardType="numeric"
                  placeholder='0-1'
                  placeholderTextColor={'#999'}
                  maxLength={6}
                  value={cognitiveValue}
                  onChangeText={(text) => {
                    if (/[^0-9.]/.test(text)) {
                      setInputWarnings(w => ({ ...w, cognitive: 'Only allow numeric values' }));
                      return;
                    }
                    let filtered = text;
                    if ((filtered.match(/\./g) || []).length > 1) {
                      filtered = filtered.slice(0, -1);
                    }
                    if (filtered && parseFloat(filtered) > 1) {
                      setInputWarnings(w => ({ ...w, cognitive: 'Value must be 0 to 1.' }));
                    } else {
                      setCognitiveValue(filtered);
                      setInputWarnings(w => ({ ...w, cognitive: false }));
                    }
                  }}
                />
                {inputWarnings.cognitive && (
                  <Text style={styles.inputError}>{inputWarnings.cognitive}</Text>
                )}
              </View>
            </View>
          </View>
        </View>
 
        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton} onPress={viewTestResults} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.actionButtonText}>Parkinson's Test Result</Text>
          )}
        </TouchableOpacity>
 
        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
 
        {/* Calculated Results */}
        {!isLoading && calculatedResults && (
          <>
            <View
              style={[
                styles.resultCard,
                {
                  borderColor: predictionResult ? predictionResult.riskColor : (calculatedResults.percentage >= 20 ? '#ff4d4f' : '#52c41a'),
                  backgroundColor: predictionResult ? (predictionResult.riskLevel === 'High' ? '#fff1f0' : '#f6ffed') : (calculatedResults.percentage >= 20 ? '#fff1f0' : '#f6ffed'),
                },
              ]}
            >
              <Text
                style={[
                  styles.resultCardTitle,
                  { color: predictionResult ? predictionResult.riskColor : (calculatedResults.percentage >= 20 ? '#ff4d4f' : '#52c41a') },
                ]}
              >
                {predictionResult
                  ? `${predictionResult.riskLevel} Risk: ${predictionResult.riskPercentage}%`
                  : (calculatedResults.percentage >= 20
                    ? 'Positive: Danger Result'
                    : 'Negative: Safe Result')}
              </Text>
              <Text style={styles.resultCardText}>
                Risk Percentage: {predictionResult ? predictionResult.riskPercentage : calculatedResults.percentage}%
              </Text>
             
              {predictionResult && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Confidence:</Text>
                  <Text style={styles.detailValue}>
                    {(predictionResult.confidence * 100).toFixed(0)}%
                  </Text>
                </View>
              )}
             
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Assessment Date:</Text>
                <Text style={styles.detailValue}>
                  {new Date().toLocaleDateString()}
                </Text>
              </View>
             
              {((predictionResult && predictionResult.riskLevel === 'Low') || (!predictionResult && calculatedResults.percentage < 20)) && (
                <View style={styles.safeContainer}>
                  <Text style={styles.safeText}>
                    The patient is safe. No immediate action is required.
                  </Text>
                </View>
              )}
            </View>
 
            {((predictionResult && predictionResult.riskLevel === 'High') || (!predictionResult && calculatedResults.percentage >= 20)) && (
              <View style={styles.precautionsCard}>
                <Text style={styles.precautionsTitle}>Precautions:</Text>
                <Text style={styles.precautionsText}>
                  - Consult a neurologist immediately.
                </Text>
                <Text style={styles.precautionsText}>
                  - Follow a healthy diet and exercise regularly.
                </Text>
                <Text style={styles.precautionsText}>
                  - Avoid stress and maintain a positive mindset.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
 
const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#ef5350',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
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
    top: 60,
    //bottom: 0,
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
    //marginBottom: 24,
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
    color: '#333333',
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
 
export default ParkinsonTestScreen;