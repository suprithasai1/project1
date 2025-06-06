'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatients, searchPatients, selectPatient } from '../../redux/slices/patientsSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomTabBar from '../../components/CustomTabBar';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/theme';

const PAGE_SIZE = 10;

const EmptyPatientList = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No patients found</Text>
  </View>
);

const PatientListScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const patients = useSelector((state) => state?.patients || {});
  const { filteredList = [], status = 'idle', searchQuery = '' } = patients;

  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredPatients = useMemo(() => {
    if (filterStatus === 'All') return filteredList;
    return filteredList.filter(p => (p.status || '').toLowerCase() === filterStatus.toLowerCase());
  }, [filteredList, filterStatus]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredPatients.length / PAGE_SIZE);

  // Get patients for current page
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredPatients.slice(start, end);
  }, [filteredPatients, currentPage]);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  // Reset to page 1 if search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPatients]);

  const handleSearch = (text) => {
    dispatch(searchPatients(text));
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPatientItem = ({ item, index }) => {
    if (!item) return null;
    const isOverdue = item.status === 'overdue';
    return (
      <TouchableOpacity
        style={styles.patientItem}
        onPress={() => {
          dispatch(selectPatient(item.id));
          navigation.navigate('PatientDetailsScreen');
        }}
        activeOpacity={0.7}
      >
        <Text style={[styles.serialColumn, styles.cell]}>{(currentPage - 1) * PAGE_SIZE + index + 1}.</Text>
        <Text style={[styles.nameColumn, styles.cell]} numberOfLines={1}>{item.name || 'N/A'}</Text>
        <Text style={[styles.ageColumn, styles.cell]}>{`${item.age || '-'} / ${item.sex || '-'}`}</Text>
        <Text style={[styles.dateColumn, styles.cell]}>{item.lastVisit || '-'}</Text>
        <Text style={[
          styles.statusColumn,
          styles.cell,
          isOverdue ? styles.overdueStatus : styles.activeStatus
        ]}>
          {item.status || 'Unknown'}
        </Text>
      </TouchableOpacity>
    );
  };

  if (patients.status === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4169E1" />
      </View>
    );
  }

  if (patients.status === 'failed') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load patients. Please try again later.</Text>
        <TouchableOpacity onPress={() => dispatch(fetchPatients())}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Generate page numbers for pagination (show max 5 pages at once)
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f0f0f0" barStyle="dark-content" />
      <CustomTabBar navigation={navigation} />

      {/* Overlay to close filter when clicking outside */}
      {showFilter && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowFilter(false)}
        />
      )}

      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#5856D6" />
          <Text style={styles.backButtonText}>Patient List</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.primary} style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search" value={searchQuery} onChangeText={handleSearch} />
        </View>
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilter(!showFilter)}>
            <Text style={styles.filterText}>Filter</Text>
            <Ionicons name="filter" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          {showFilter && (
            <View style={styles.filterOptions}>
              {['All', 'Active', 'overdue'].map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterOption,
                    filterStatus === status && styles.filterOptionActive
                  ]}
                  onPress={() => {
                    setFilterStatus(status);
                    setShowFilter(false);
                  }}
                >
                  <Text style={{ color: filterStatus === status ? '#fff' : '#5856D6' }}>{status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.columnHeader, styles.serialColumn]}>S.no</Text>
          <Text style={[styles.columnHeader, styles.nameColumn]}>Patient Name</Text>
          <Text style={[styles.columnHeader, styles.ageColumn]}>Age/Sex</Text>
          <Text style={[styles.columnHeader, styles.dateColumn]}>Last visit</Text>
          <Text style={[styles.columnHeader, styles.statusColumn]}>Status</Text>
        </View>

        <FlatList
          style={styles.valueContainer}
          data={paginatedPatients}
          renderItem={renderPatientItem}
          keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={EmptyPatientList}
        />
      </View>

      <View style={styles.pagination}>
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Text style={[styles.paginationText, currentPage === 1 && { color: '#ccc' }]}>{'< Prev'}</Text>
        </TouchableOpacity>
        <View style={styles.pageNumbers}>
          {getPageNumbers().map((page) => (
            <TouchableOpacity
              key={page}
              style={page === currentPage ? styles.pageNumberActive : styles.pageNumber}
              onPress={() => handlePageChange(page)}
            >
              <Text style={page === currentPage ? styles.pageNumberTextActive : styles.pageNumberText}>
                {page}
              </Text>
            </TouchableOpacity>
          ))}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <Text style={styles.pageNumberText}>...</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Text style={[styles.paginationText, currentPage === totalPages && { color: '#ccc' }]}>{'Next >'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ' #F5F6FA',
  },
  cell: {
    fontSize: 14,
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
   
    color: 'rgb(100, 100, 102)',
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 60,
    paddingBottom: 4,
    //backgroundColor: '#fff',
    elevation: 2,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 4,
    color: '#5856D6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 10,
    marginBottom: 6,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 10,
    marginRight: 8,
    height: 42,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  filterText: {
    color: '#5856D6',
    fontWeight: 'bold',
    marginRight: 4,
    fontSize: 15,
  },
  filterOptions: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    zIndex: 10, // Make sure this is higher than overlay
    padding: 6,
    flexDirection: 'column',
  },
  filterOption: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginVertical: 2,
    backgroundColor: '#f0f0f0',
  },
  filterOptionActive: {
    backgroundColor: '#5856D6',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    paddingBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgb(239, 239, 255)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(173, 167, 255)',
  },
  columnHeader: {
    fontWeight: 'bold',
    color: 'rgb(35, 32, 207)',
    fontSize: 15,
    textAlign: 'center',
  },
  serialColumn: {
    flex: 0.9,
    textAlign: 'center',
  
  },
  nameColumn: {
    flex: 2.0,
    textAlign: 'left',
    paddingLeft: 6,
    
  },
  ageColumn: {
    flex: 1.1,
    textAlign: 'center',
    
    //paddingLeft: 14,
    //paddingRight: 10,
  },
  dateColumn: {
    flex: 1.5,
    textAlign: 'center',
  },
  statusColumn: {
    flex: 1,
    textAlign: 'center',
   
  },
  valueContainer: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  listContainer: {
    paddingBottom: 10,
  },
  patientItem: {
    flex: 1,
    fontFamily: 'sans-serif',
    fontSize: 14,
    // fontWeight: '400',
    fontStyle:'bold',
    color: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  serialNumber: {
    flex: 0.7,
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
  },
  patientInfo: {
    flex: 2.2,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
    textAlign: 'left',
  },
  patientAge: {
    fontSize: 13,
    color: '#666',
    textAlign: 'left',
    marginTop: 2,
  },
  visitDate: {
    flex: 1.5,
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
  },
  status: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeStatus: {
    color: 'green',
  },
  overdueStatus: {
    color: 'red',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 12,
  },
  retryText: {
    color: '#5856D6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  paginationButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  paginationText: {
    fontSize: 16,
    color: '#5856D6',
    fontWeight: 'bold',
  },
  pageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  pageNumber: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 2,
    backgroundColor: '#f0f0f0',
  },
  pageNumberActive: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 2,
    backgroundColor: '#5856D6',
  },
  pageNumberText: {
    fontSize: 16,
    color: '#5856D6',
    fontWeight: 'bold',
  },
  pageNumberTextActive: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9,
  },
});

export default PatientListScreen;
