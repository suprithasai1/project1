// import React from 'react';
// import { View, Text, StyleSheet, FlatList,TouchableOpacity} from 'react-native';
// import { useSelector } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { selectAllTests } from '../../redux/slices/brainTestSlice';
// import Header from '../../components/Header';
// import BrainTestCard from '../../components/BrainTestCard';

// const BrainTestScreen = () => {
//   const rawTests = useSelector(selectAllTests) || []; // Fetch raw test data from Redux
//   const navigation = useNavigation();

//   // Map `name` to `type`
//   const tests = rawTests.map((test) => ({
//     ...test,
//     type: test.name, // Use `name` as `type`
//   }));

//   const handleTestPress = (test) => {
//     if (!test || !test.type) {
//       console.warn('Unknown test type or invalid test object:', test);
//       return;
//     }

//     // Navigate to the appropriate screen based on the test type
//     switch (test.type) {
//       case 'Parkinson':
//         navigation.navigate('ParkinsonTestScreen', { testId: test.id });
//         break;
//       case 'Epilepsy':
//         navigation.navigate('EpilepsyTestScreen', { testId: test.id });
//         break;
//       case 'Alzheimer':
//         navigation.navigate('AlzheimerTestScreen', { testId: test.id });
//         break;
//       default:
//         console.warn('Unknown test type:', test.type);
//     }
//   };

//   console.log('Tests data:', tests); // Debug log

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.navigationBar}>
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={20} color="#5856D6" />
//           <Text style={styles.backButtonText}>Brain Test</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.content}>
//         {tests.length === 0 ? (
//           <Text style={styles.emptyMessage}>No tests available</Text>
//         ) : (
//           <View style={styles.cardContainer}>
//             <FlatList
//               data={tests}
//               numColumns={2}
//               renderItem={({ item }) => (
//                 <BrainTestCard test={item} onPress={() => handleTestPress(item)} style={styles.card} />
//               )}
//               keyExtractor={(item) => item.id}
//               contentContainerStyle={styles.listContent}
//               columnWrapperStyle={{ justifyContent: 'space-between' }}
//             />
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FB',
//   },
//   content: {
//     flex: 1,
//     padding: 6,
//   },
  
//   cardContainer: {
//     flex: 1,
//     marginTop: 10,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     paddingVertical: 10,
//     paddingHorizontal: 6,
//     borderWidth: 2,
//     borderColor: '#e0e0e0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.06,
//     shadowRadius: 10,
//     elevation: 4,
//   },
//   listContent: {
//     paddingVertical: 8,
//     paddingBottom: 24,
//   },
//   emptyMessage: {
//     fontSize: 16,
//     color: '#999',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   navigationBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     paddingBottom: 0,
//     backgroundColor: '#F8F9FB',
//   },
//   backButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backButtonText: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     color: '#5856D6',
//     paddingLeft: 8,
//   },
//   card: {
//     width: '46%',
//     margin: '2%',
//     backgroundColor: '#EAF0FB', // Soft blue for brain test theme
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 3,
//     paddingVertical: 22,
//     borderWidth: 1,
//     borderColor: '#BFD7ED', // Matching border color
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 6,
//   },
// });

// export default BrainTestScreen;
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { selectAllTests } from '../../redux/slices/brainTestSlice';
import BrainTestCard from '../../components/BrainTestCard';

const COLORS = {
  background: '#F7F9FC',
  primary: '#1976D2',
  accent: '#009688',
  cardBackground: '#FFFFFF',
  cardHighlight: '#EAF0FB',
  border: '#BFD7ED',
  textPrimary: '#212121',
  textSecondary: '#757575',
};

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
    <SafeAreaView style={styles.container}>
      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'rgb(247, 249, 252)', // Light background color
    //padding: 0,
   // paddingTop: 0, // Remove top padding for better alignment
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.background,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.primary,
    paddingLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 6,
  },
  cardContainer: {
    flex: 1,
    //marginLeft: 6,
    //marginRight: 25,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 6,
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
    color: COLORS.textSecondary,
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
