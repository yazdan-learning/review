import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Searchbar, Title, Card, Paragraph, Chip } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Place } from '../types';
import { mockSearchResults, mockPlaces } from '../mockData';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;

interface Props {
  navigation: SearchScreenNavigationProp;
}

export default function SearchScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = mockSearchResults(searchQuery);
      setFilteredPlaces(results);
      setShowDropdown(true);
    } else {
      setFilteredPlaces([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

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
    <TouchableOpacity onPress={() => handlePlaceSelect(item)}>
      <Card style={styles.dropdownItem}>
        <Card.Content>
          <View style={styles.itemHeader}>
            <Title style={styles.itemName}>{item.name}</Title>
            <Chip 
              style={[styles.typeChip, { backgroundColor: getPlaceTypeColor(item.type) }]}
              textStyle={{ color: 'white' }}
              compact
            >
              {item.type.replace('_', ' ')}
            </Chip>
          </View>
          <View style={styles.itemDetails}>
            <Paragraph style={styles.stars}>{renderStars(item.rating)}</Paragraph>
            <Paragraph style={styles.rating}>{item.rating}</Paragraph>
            <Paragraph style={styles.priceLevel}>{renderPriceLevel(item.priceLevel)}</Paragraph>
          </View>
          <Paragraph style={styles.address} numberOfLines={1}>{item.address}</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const popularPlaces = mockPlaces.slice(0, 3);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Find Places & Reviews</Title>
      
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search for restaurants, hotels, shops..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          onFocus={() => {
            if (searchQuery.trim().length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        
        {showDropdown && filteredPlaces.length > 0 && (
          <View style={styles.dropdown}>
            <FlatList
              data={filteredPlaces}
              renderItem={renderDropdownItem}
              keyExtractor={(item) => item.id}
              style={styles.dropdownList}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        )}
      </View>

      {!showDropdown && (
        <Card style={styles.popularCard}>
          <Card.Title title="Popular Places" subtitle="Tap to view details" />
          <Card.Content>
            {popularPlaces.map((place) => (
              <TouchableOpacity 
                key={place.id} 
                onPress={() => handlePlaceSelect(place)}
              >
                <Card style={styles.popularItem}>
                  <Card.Content>
                    <View style={styles.itemHeader}>
                      <Title style={styles.itemName}>{place.name}</Title>
                      <Chip 
                        style={[styles.typeChip, { backgroundColor: getPlaceTypeColor(place.type) }]}
                        textStyle={{ color: 'white' }}
                        compact
                      >
                        {place.type.replace('_', ' ')}
                      </Chip>
                    </View>
                    <View style={styles.itemDetails}>
                      <Paragraph style={styles.stars}>{renderStars(place.rating)}</Paragraph>
                      <Paragraph style={styles.rating}>{place.rating}</Paragraph>
                      <Paragraph style={styles.priceLevel}>{renderPriceLevel(place.priceLevel)}</Paragraph>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 30,
    fontSize: 24,
  },
  searchContainer: {
    position: 'relative',
    zIndex: 1,
  },
  searchbar: {
    marginBottom: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    maxHeight: 300,
    zIndex: 1000,
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownItem: {
    margin: 5,
    elevation: 2,
  },
  popularCard: {
    marginTop: 20,
  },
  popularItem: {
    marginVertical: 5,
    backgroundColor: '#ffffff',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
  },
  typeChip: {
    marginLeft: 10,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  stars: {
    fontSize: 14,
    color: '#FFD700',
    marginRight: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 15,
  },
  priceLevel: {
    fontSize: 14,
    color: '#00b894',
    fontWeight: 'bold',
  },
  address: {
    fontSize: 12,
    color: '#666',
  },
});