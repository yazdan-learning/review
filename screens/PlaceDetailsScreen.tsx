import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Divider, List } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Review } from '../types';
import { mockReviewSummary } from '../mockData';

type PlaceDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PlaceDetails'>;
type PlaceDetailsScreenRouteProp = RouteProp<RootStackParamList, 'PlaceDetails'>;

interface Props {
  navigation: PlaceDetailsScreenNavigationProp;
  route: PlaceDetailsScreenRouteProp;
}

const { width } = Dimensions.get('window');

export default function PlaceDetailsScreen({ navigation, route }: Props) {
  const { place } = route.params;
  const [showReviews, setShowReviews] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const summary = mockReviewSummary;

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const renderPriceLevel = (level: number) => {
    return '$'.repeat(level);
  };

  const renderReview = (review: Review) => (
    <Card key={review.id} style={styles.reviewCard}>
      <Card.Content>
        <View style={styles.reviewHeader}>
          <Title style={styles.authorName}>{review.authorName}</Title>
          <View style={styles.reviewRating}>
            <Paragraph style={styles.reviewStars}>
              {renderStars(review.rating)}
            </Paragraph>
            <Paragraph style={styles.reviewScore}>{review.rating}</Paragraph>
          </View>
        </View>
        <Paragraph style={styles.reviewText}>{review.text}</Paragraph>
        <Paragraph style={styles.reviewTime}>{review.relativeTimeDescription}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      {/* 1. Place Info Card */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.placeName}>{place.name}</Title>
          <View style={styles.ratingContainer}>
            <Paragraph style={styles.stars}>{renderStars(place.rating)}</Paragraph>
            <Paragraph style={styles.rating}>{place.rating}</Paragraph>
            <Paragraph style={styles.priceLevel}>{renderPriceLevel(place.priceLevel)}</Paragraph>
          </View>
          <Paragraph style={styles.address}>{place.address}</Paragraph>
          <View style={styles.chipContainer}>
            <Chip style={styles.typeChip}>{place.type.replace('_', ' ')}</Chip>
          </View>
        </Card.Content>
      </Card>

      {/* 2. AI Review Summary */}
      <Card style={styles.summaryCard}>
        <Card.Title title="AI Review Summary" subtitle={`Based on ${summary.total_reviews} reviews`} />
        <Card.Content>
          <View style={styles.summaryRating}>
            <Title style={styles.summaryScore}>{summary.overall_rating}/5</Title>
            <Paragraph style={styles.summaryStars}>
              {renderStars(summary.overall_rating)}
            </Paragraph>
          </View>
          
          <Paragraph style={styles.summaryText}>{summary.sentiment_summary}</Paragraph>
          
          <Divider style={styles.divider} />
          
          <Title style={styles.sectionTitle}>Pros</Title>
          {summary.pros.map((pro, index) => (
            <Paragraph key={index} style={styles.listItem}>• {pro}</Paragraph>
          ))}
          
          <Title style={styles.sectionTitle}>Cons</Title>
          {summary.cons.map((con, index) => (
            <Paragraph key={index} style={styles.listItem}>• {con}</Paragraph>
          ))}
          
          <Divider style={styles.divider} />
          
          <Title style={styles.sectionTitle}>Recommendation</Title>
          <Paragraph style={styles.recommendation}>{summary.recommendation}</Paragraph>
        </Card.Content>
      </Card>

      {/* 3. Chat Bot Button */}
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Chat', { place })}
        style={styles.chatButton}
        icon="chat"
      >
        Ask Questions About This Place
      </Button>

      {/* 4. Google Map */}
      <Card style={styles.mapCard}>
        <Card.Title title="Location" />
        <Card.Content>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: place.location.latitude,
              longitude: place.location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={place.location}
              title={place.name}
              description={place.address}
            />
          </MapView>
        </Card.Content>
      </Card>

      {/* 5. Individual Reviews (Collapsed by Default) */}
      <Card style={styles.reviewsCard}>
        <Card.Title 
          title="Customer Reviews" 
          subtitle={`${place.reviews?.length || 0} reviews`}
          right={(props) => (
            <Button
              onPress={() => setShowReviews(!showReviews)}
              mode="text"
              compact
            >
              {showReviews ? 'Hide Reviews' : 'Show Reviews'}
            </Button>
          )}
        />
        {showReviews && (
          <Card.Content>
            {place.reviews && place.reviews.length > 0 ? (
              <>
                {(showAllReviews ? place.reviews : place.reviews.slice(0, 3)).map(renderReview)}
                
                {place.reviews.length > 3 && (
                  <Button
                    mode="outlined"
                    onPress={() => setShowAllReviews(!showAllReviews)}
                    style={styles.showMoreButton}
                  >
                    {showAllReviews ? 'Show Less' : `Show All ${place.reviews.length} Reviews`}
                  </Button>
                )}
              </>
            ) : (
              <Paragraph>No reviews available for this place.</Paragraph>
            )}
          </Card.Content>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    margin: 10,
  },
  placeName: {
    fontSize: 24,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stars: {
    fontSize: 18,
    color: '#FFD700',
    marginRight: 8,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
  },
  priceLevel: {
    fontSize: 18,
    color: '#00b894',
    fontWeight: 'bold',
  },
  address: {
    color: '#666',
    marginBottom: 15,
    fontSize: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  typeChip: {
    backgroundColor: '#e8f4f8',
  },

  mapCard: {
    margin: 10,
  },
  map: {
    width: width - 60,
    height: 200,
    borderRadius: 8,
  },
  summaryCard: {
    margin: 10,
  },
  summaryRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryScore: {
    fontSize: 32,
    marginRight: 15,
    color: '#00b894',
  },
  summaryStars: {
    fontSize: 24,
    color: '#FFD700',
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  divider: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#2d3436',
  },
  listItem: {
    fontSize: 14,
    marginBottom: 5,
    color: '#636e72',
  },
  recommendation: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
    color: '#2d3436',
  },
  chatButton: {
    margin: 15,
    paddingVertical: 5,
  },
  reviewsCard: {
    margin: 10,
    marginBottom: 30,
  },
  reviewCard: {
    marginVertical: 8,
    backgroundColor: '#ffffff',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorName: {
    fontSize: 16,
    flex: 1,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewStars: {
    fontSize: 14,
    color: '#FFD700',
    marginRight: 5,
  },
  reviewScore: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewTime: {
    fontSize: 12,
    color: '#666',
  },
  showMoreButton: {
    marginTop: 15,
  },
});