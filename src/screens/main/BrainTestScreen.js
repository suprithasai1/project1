import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { selectAllTests } from '../../redux/slices/brainTestSlice';
import BrainTestCard from '../../components/BrainTestCard';
import { COLORS } from '../../constants/theme';

const BrainTestScreen = () => {
  const rawTests = useSelector(selectAllTests) || [];
  const navigation = useNavigation();

  const tests = rawTests.map((test) => ({
    ...test,
    type: test.name,
  }));

  const handleTestPress = (test) => {
    if (!test || !test.type) {
      console.warn('Unknown test type or invalid test object:', test);
      return;
    }

    switch (test.type) {
      case 'Parkinson':
        navigation.navigate('ParkinsonTestScreen', { testId: test.id });
        break;
      case 'Epilepsy':
        navigation.navigate('EpilepsyTestScreen', { testId: test.id });
        break;
      case 'Alzheimer':
        navigation.navigate('AlzheimerTestScreen', { testId: test.id });
        break;
      default:
        console.warn('Unknown test type:', test.type);
        break;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: 'rgb(247, 247, 247)' }} // dark header background
    >
      {/* Header background */}
      <View style={{ height: 120, backgroundColor: 'rgb(255, 255, 255)' }} />
      <View style={{ flex: 1, marginTop: -60 }}>
        <View style={styles.navigationBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.primaryDark} />
            <Text style={styles.backButtonText}>Brain Test</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {tests.length === 0 ? (
            <Text style={styles.emptyMessage}>No tests available</Text>
          ) : (
            <View style={styles.cardContainer}>
              <FlatList
                data={tests}
                numColumns={2}
                renderItem={({ item }) => (
                  <BrainTestCard test={item} onPress={() => handleTestPress(item)} style={styles.card} />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
              />
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: ' #ffffff', // Use white for the whole background
  // },
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.background,
    marginTop: -20, // Adjusted to avoid overlap with the header
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: COLORS.primaryDark,
    paddingLeft: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  cardContainer: {
    flex: 1,
    //marginLeft: 6,
    //marginRight: 25,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 1,
    borderWidth: 2,
    borderColor: 'rgb(197, 204, 233)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  listContent: {
    paddingBottom: 32,
  },
  emptyMessage: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    width: '40%',
    marginVertical: 8,
    //marginRight: '2%',
    // marginHorizontal: '1.5%',
    backgroundColor: 'rgb(130, 154, 199)', // Soft blue for brain test theme
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    borderWidth: 5,
    borderColor: 'rgb(41, 78, 228)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
});

export default BrainTestScreen;
