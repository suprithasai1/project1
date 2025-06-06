

import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity, Linking, Animated } from 'react-native';
import { useRef, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../constants/theme';

const ProfileScreen = ({ route, navigation  }) => {
  const patient = route?.params?.patient;
  const [imgPressed, setImgPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  if (!patient) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>No Patient Data</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Animation for profile image
  const handleImgPressIn = () => {
    setImgPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 1.08,
      useNativeDriver: true,
    }).start();
  };
  const handleImgPressOut = () => {
    setImgPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Contact actions
  const handleCall = () => {
    if (patient.phone) Linking.openURL(`tel:${patient.phone}`);
  };
  const handleEmail = () => {
    if (patient.email) Linking.openURL(`mailto:${patient.email}`);
  };

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.navigationBar}>
              <TouchableOpacity style={styles.backButtons} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={20} color="#5856D6" />
                <Text style={styles.backButtonsText}>Patient Profile</Text>
              </TouchableOpacity>
            </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={handleImgPressIn}
            onPressOut={handleImgPressOut}
            style={styles.imgTouch}
          >
            <Animated.Image
              source={
                patient.profileImage
                  ? (typeof patient.profileImage === 'string'
                      ? { uri: patient.profileImage }
                      : patient.profileImage)
                  : require('../../Assets/image/profile-image.jpg')
              }
              style={[styles.profileImage, { transform: [{ scale: scaleAnim }] }]}
            />
          </TouchableOpacity>
          <Text style={styles.title}>{patient.name}</Text>
          <Text style={styles.subtitle}>Patient ID: {patient.id}</Text>

          {/* Contact Card */}
          <View style={styles.contactCard}>
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleCall}
              disabled={!patient.phone}
              activeOpacity={patient.phone ? 0.7 : 1}
            >
              <Ionicons name="call" size={22} color={patient.phone ? '#4caf50' : '#bbb'} style={styles.contactIcon} />
              <View style={styles.contactTextBlock}>
                <Text style={styles.contactLabel}>Phone</Text>
                
                <Text style={[styles.contactValue, !patient.phone && styles.contactValueDisabled]} numberOfLines={1}>{patient.phone || 'N/A'}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.contactDivider} />
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleEmail}
              disabled={!patient.email}
              activeOpacity={patient.email ? 0.7 : 1}
            >
              <Ionicons name="mail" size={22} color={patient.email ? COLORS.primary : '#bbb'} style={styles.contactIcon} />
              <View style={styles.contactTextBlock}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={[styles.contactValue, !patient.email && styles.contactValueDisabled]} numberOfLines={1}>{patient.email || 'N/A'}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Info Sections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}><Ionicons name="person" size={18} color={COLORS.primaryDark} />  Personal</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Age:</Text><Text style={styles.infoValue}>{patient.age}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Gender:</Text><Text style={styles.infoValue}>{patient.sex}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Height:</Text><Text style={styles.infoValue}>{patient.height}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Weight:</Text><Text style={styles.infoValue}>{patient.weight}</Text></View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}><Ionicons name="medkit" size={18} color={COLORS.primaryDark} />  Medical</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Blood Type:</Text><Text style={styles.infoValue}>{patient.bloodType}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Allergies:</Text><Text style={styles.infoValue}>{patient.allergies}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Diseases:</Text><Text style={styles.infoValue}>{patient.diseases}</Text></View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}><Ionicons name="calendar" size={18} color={COLORS.primaryDark} />  Last Visit</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Date:</Text><Text style={styles.infoValue}>{patient.lastVisit}</Text></View>
          </View>
        </View>

        {/* Floating Edit Button */}
        <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => {}}>
          <Ionicons name="create-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    top:30,
   
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
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    paddingBottom: 50,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 20,
    //marginBottom: 24,
  },
  imgTouch: {
    marginBottom: 10,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: 'rgb(219, 218, 233)',
    backgroundColor: ' #eaeaea',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgb(39, 39, 54)',
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4fa',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 18,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
    width: '100%',
    gap: 0,
  },
  contactItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 2,
    minWidth: 0,
  },
  contactIcon: {
    marginRight: 8,
    marginBottom: 20,
  },
  contactTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  contactLabel: {
    fontSize: 16,
    color: 'rgb(75, 74, 94)',
    fontWeight: 'bold',
    marginBottom: 0,
  },
  contactValue: {
    fontSize: 14,
    color: '#222',
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'left',
    //marginRight: 50,
    // marginLeft:5,
    right: 26,
    marginTop: 1,
  },
  contactValueDisabled: {
    color: '#bbb',
  },
  contactDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
    borderRadius: 1,
  },
  section: {
    width: '100%',
    backgroundColor: '#f7f8fa',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#444',
    fontSize: 15,
    minWidth: 90,
  },
  infoValue: {
    color: '#222',
    fontSize: 15,
    flexShrink: 1,
    textAlign: 'right',
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    backgroundColor: COLORS.primaryDark,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default ProfileScreen;
