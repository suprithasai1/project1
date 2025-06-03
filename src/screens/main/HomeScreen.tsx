import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const brainTests = [
    {
      id: '1',
      name: 'Parkinson\'s Test',
      icon: 'brain',
      color: ['#FF6B6B', '#FF8787'],
      image: require('../../Assets/image/parkinson-card.jpeg'),
    },
    {
      id: '2',
      name: 'Alzheimer\'s Test',
      icon: 'pulse',
      color: ['#4ECDC4', '#45B7AF'],
      image: require('../../Assets/image/Alzheimers-cards.jpg'),
    },
    {
      id: '3',
      name: 'Epilepsy Test',
      icon: 'flash',
      color: ['#FFD93D', '#FFB302'],
      image: require('../../Assets/image/epilepsy-card.jpeg'),
    },
  ];

  const quickActions = [
    { id: '1', name: 'Add Patient', icon: 'person-add' },
    { id: '2', name: 'Schedule', icon: 'calendar' },
    { id: '3', name: 'Reports', icon: 'document-text' },
    { id: '4', name: 'Messages', icon: 'chatbubbles' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.doctorName}>Dr. Alex</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.quickActionsContainer}>
        {quickActions.map(action => (
          <TouchableOpacity key={action.id} style={styles.quickActionButton}>
            <Icon name={action.icon} size={24} color="#6C63FF" />
            <Text style={styles.quickActionText}>{action.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Brain Tests</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.testsContainer}
      >
        {brainTests.map(test => (
          <TouchableOpacity
            key={test.id}
            onPress={() => navigation.navigate(test.name.split(' ')[0])}
          >
            <LinearGradient
              colors={test.color}
              style={[styles.testCard, { width: width * 0.7 }]}
            >
              <Image source={test.image} style={styles.testImage} />
              <View style={styles.testInfo}>
                <Icon name={test.icon} size={24} color="#FFF" />
                <Text style={styles.testName}>{test.name}</Text>
                <Text style={styles.testDescription}>Tap to start assessment</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Today's Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Patients</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Tests</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  quickActionButton: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    width: '22%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    padding: 20,
    paddingBottom: 10,
  },
  testsContainer: {
    paddingHorizontal: 15,
  },
  testCard: {
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
    height: 200,
  },
  testImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  testInfo: {
    padding: 15,
  },
  testName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  testDescription: {
    color: '#FFF',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 5,
  },
  statsContainer: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default HomeScreen;