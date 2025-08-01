import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, Button, Title, Card } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;

interface Props {
  navigation: SearchScreenNavigationProp;
}

export default function SearchScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('PlaceList', { searchQuery: searchQuery.trim() });
    }
  };

  const popularSearches = ['restaurant', 'hotel', 'cafe', 'shopping'];

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Find Places & Reviews</Title>
      
      <Searchbar
        placeholder="Search for restaurants, hotels, shops..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={handleSearch}
        style={styles.searchbar}
      />
      
      <Button
        mode="contained"
        onPress={handleSearch}
        disabled={!searchQuery.trim()}
        style={styles.searchButton}
      >
        Search Places
      </Button>

      <Card style={styles.popularCard}>
        <Card.Title title="Popular Searches" />
        <Card.Content>
          <View style={styles.popularContainer}>
            {popularSearches.map((search) => (
              <Button
                key={search}
                mode="outlined"
                onPress={() => {
                  setSearchQuery(search);
                  navigation.navigate('PlaceList', { searchQuery: search });
                }}
                style={styles.popularButton}
              >
                {search}
              </Button>
            ))}
          </View>
        </Card.Content>
      </Card>
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
  searchbar: {
    marginBottom: 20,
  },
  searchButton: {
    marginBottom: 30,
  },
  popularCard: {
    marginTop: 20,
  },
  popularContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  popularButton: {
    flex: 1,
    minWidth: '45%',
  },
});