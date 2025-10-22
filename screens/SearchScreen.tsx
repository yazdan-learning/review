import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Searchbar, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Place } from '../types';
import { mockSearchResults, mockPlaces } from '../mockData';
import { searchPlaces, isApiKeyConfigured } from '../services/googlePlacesApi';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;

interface Props {
  navigation: SearchScreenNavigationProp;
}

export default function SearchScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useGoogleApi, setUseGoogleApi] = useState(isApiKeyConfigured());
  
  // Debug: Check API configuration on component mount
  useEffect(() => {
    const checkApiConfig = () => {
      const isConfigured = isApiKeyConfigured();
      console.log('🔄 SearchScreen Mount - API Check:', {
        isApiKeyConfigured: isConfigured,
        useGoogleApi: useGoogleApi,
        needsUpdate: isConfigured !== useGoogleApi
      });
      
      if (isConfigured !== useGoogleApi) {
        console.log('🔄 Updating useGoogleApi state to:', isConfigured);
        setUseGoogleApi(isConfigured);
      }
    };
    
    checkApiConfig();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setLoading(true);
        try {
          let results: Place[];
          
          if (useGoogleApi) {
            // Use real Google Places API
            results = await searchPlaces(searchQuery);
          } else {
            // Fallback to mock data
            results = mockSearchResults(searchQuery);
          }
          
          setFilteredPlaces(results);
          setShowDropdown(true);
        } catch (error) {
          console.error('Search error:', error);
          Alert.alert(
            'Search Error',
            'Failed to search places. Using offline data.',
            [{ text: 'OK' }]
          );
          // Fallback to mock data on error
          const results = mockSearchResults(searchQuery);
          setFilteredPlaces(results);
          setShowDropdown(true);
        } finally {
          setLoading(false);
        }
      } else {
        setFilteredPlaces([]);
        setShowDropdown(false);
        setLoading(false);
      }
    }, 500); // 500ms delay for debouncing

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, useGoogleApi]);

  const handlePlaceSelect = (place: Place) => {
    setSearchQuery('');
    setShowDropdown(false);
    navigation.navigate('PlaceDetails', { place });
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const renderPriceLevel = (level: number) => {
    return '$'.repeat(level);
  };

  const getPlaceTypeColor = (type: string) => {
    switch (type) {
      case 'restaurant': return '#FF6B6B';
      case 'hotel': return '#4ECDC4';
      case 'cafe': return '#45B7D1';
      case 'electronics_store': return '#96CEB4';
      default: return '#FFEAA7';
    }
  };

  const renderDropdownItem = ({ item }: { item: Place }) => (
    <TouchableOpacity 
      onPress={() => handlePlaceSelect(item)}
      style={styles.dropdownItem}
    >
      <View style={styles.dropdownItemContent}>
        <Paragraph style={styles.placeName}>{item.name}</Paragraph>
        <Paragraph style={styles.placeAddress} numberOfLines={1}>{item.address}</Paragraph>
      </View>
      <View style={styles.placeRating}>
        <Paragraph style={styles.ratingText}>⭐ {item.rating}</Paragraph>
      </View>
    </TouchableOpacity>
  );

  const popularPlaces = mockPlaces.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, showDropdown && styles.searchContainerTop]}>
        {!showDropdown && (
          <Title style={styles.title}>Find Places & Reviews</Title>
        )}
        <Searchbar
          placeholder={useGoogleApi ? "Search real places worldwide..." : "Search demo places..."}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          onFocus={() => {
            if (searchQuery.trim().length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" />
            <Paragraph style={styles.loadingText}>Searching places...</Paragraph>
          </View>
        )}
        
        {/* Debug info */}
        {showDropdown && filteredPlaces.length > 0 && (
          <Paragraph style={styles.debugInfo}>
            Showing {filteredPlaces.length} results
          </Paragraph>
        )}
        
        {showDropdown && filteredPlaces.length > 0 && !loading && (
          <View style={styles.dropdown}>
            <ScrollView
              style={styles.dropdownScrollView}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              bounces={true}
              nestedScrollEnabled={true}
              scrollEnabled={true}
              alwaysBounceVertical={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {filteredPlaces.map((item, index) => (
                <View key={item.id}>
                  {renderDropdownItem({ item })}
                  {index < filteredPlaces.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        
        {showDropdown && filteredPlaces.length === 0 && !loading && searchQuery.trim().length > 2 && (
          <View style={styles.dropdown}>
            <View style={styles.noResultsContainer}>
              <Paragraph style={styles.noResultsText}>
                No places found for "{searchQuery}"
              </Paragraph>
            </View>
          </View>
        )}
      </View>

      {!showDropdown && (
        <View style={styles.popularSection}>
          <Title style={styles.sectionTitle}>Popular Places</Title>
          {popularPlaces.map((place) => (
            <TouchableOpacity 
              key={place.id} 
              onPress={() => handlePlaceSelect(place)}
              style={styles.popularItem}
            >
              <View style={styles.dropdownItemContent}>
                <Paragraph style={styles.placeName}>{place.name}</Paragraph>
                <Paragraph style={styles.placeAddress} numberOfLines={1}>{place.address}</Paragraph>
              </View>
              <View style={styles.placeRating}>
                <Paragraph style={styles.ratingText}>⭐ {place.rating}</Paragraph>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
  },
  searchContainer: {
    position: 'relative',
    zIndex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  searchContainerTop: {
    paddingTop: 20,
  },
  searchbar: {
    marginBottom: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 70,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    maxHeight: 500,
    zIndex: 1000,
  },
  dropdownScrollView: {
    flex: 1,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  dropdownItemContent: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 14,
    color: '#666',
  },
  placeRating: {
    marginLeft: 12,
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  popularSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: '#333',
  },
  popularItem: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
  },
  noResultsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  debugInfo: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
});