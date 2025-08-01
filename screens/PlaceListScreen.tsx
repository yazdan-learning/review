import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, ActivityIndicator } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Place } from '../types';
import { mockSearchResults } from '../mockData';

type PlaceListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PlaceList'>;
type PlaceListScreenRouteProp = RouteProp<RootStackParamList, 'PlaceList'>;

interface Props {
  navigation: PlaceListScreenNavigationProp;
  route: PlaceListScreenRouteProp;
}

export default function PlaceListScreen({ navigation, route }: Props) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = route.params;

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      const results = mockSearchResults(searchQuery);
      setPlaces(results);
      setLoading(false);
    }, 1000);
  }, [searchQuery]);

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

  const renderPlaceItem = ({ item }: { item: Place }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.placeName}>{item.name}</Title>
          <Chip 
            style={[styles.typeChip, { backgroundColor: getPlaceTypeColor(item.type) }]}
            textStyle={{ color: 'white' }}
          >
            {item.type.replace('_', ' ')}
          </Chip>
        </View>
        
        <View style={styles.ratingContainer}>
          <Paragraph style={styles.stars}>{renderStars(item.rating)}</Paragraph>
          <Paragraph style={styles.rating}>{item.rating}</Paragraph>
          <Paragraph style={styles.priceLevel}>{renderPriceLevel(item.priceLevel)}</Paragraph>
        </View>
        
        <Paragraph style={styles.address}>{item.address}</Paragraph>
        
        <View style={styles.statusContainer}>
          <Chip 
            style={[styles.statusChip, { backgroundColor: item.isOpen ? '#00b894' : '#e17055' }]}
            textStyle={{ color: 'white' }}
          >
            {item.isOpen ? 'Open' : 'Closed'}
          </Chip>
        </View>
      </Card.Content>
      
      <Card.Actions>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('PlaceDetails', { place: item })}
          style={styles.reviewButton}
        >
          Show Reviews
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Title style={styles.loadingText}>Searching for "{searchQuery}"...</Title>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.resultsTitle}>
        Found {places.length} places for "{searchQuery}"
      </Title>
      
      <FlatList
        data={places}
        renderItem={renderPlaceItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 20,
    textAlign: 'center',
  },
  resultsTitle: {
    padding: 20,
    textAlign: 'center',
  },
  listContainer: {
    padding: 10,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  placeName: {
    flex: 1,
    fontSize: 18,
  },
  typeChip: {
    marginLeft: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    fontSize: 16,
    color: '#FFD700',
    marginRight: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 15,
  },
  priceLevel: {
    fontSize: 16,
    color: '#00b894',
    fontWeight: 'bold',
  },
  address: {
    color: '#666',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  statusChip: {
    paddingHorizontal: 8,
  },
  reviewButton: {
    flex: 1,
    marginHorizontal: 10,
  },
});