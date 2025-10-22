import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Divider,
  Paper,
  Collapse,
  CircularProgress,
  Alert
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { Place, Review, ReviewSummary } from '../types';
import { mockReviewSummary } from '../services/mockData';
import { getAISummaryFromN8n } from '../services/googlePlacesApi';

// Helper function to parse AI text into structured summary
const parseAISummaryText = (text: string, place: Place): ReviewSummary => {
  // If text is too short, return demo data
  if (!text || text.length < 50) {
    return mockReviewSummary;
  }

  // Try to parse the text into structured format
  // The AI text is usually a paragraph, so we'll use it as sentiment_summary
  return {
    overall_rating: place.rating || 4.0,
    total_reviews: place.reviews?.length || 0,
    sentiment_summary: text.trim(),
    pros: [
      "Based on customer feedback",
      "See reviews below for details",
      "Multiple positive mentions"
    ],
    cons: [
      "See reviews for specific concerns",
      "Individual experiences may vary"
    ],
    key_themes: [
      "Customer Service",
      "Quality",
      "Experience"
    ],
    recommendation: "Check individual reviews for detailed insights."
  };
};

const PlaceDetailsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { place: initialPlace } = location.state as { place: Place };
  const [place, setPlace] = useState<Place>(initialPlace);
  const [showReviews, setShowReviews] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [summary, setSummary] = useState<ReviewSummary>(mockReviewSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Send reviews to n8n for AI summarization on mount
  useEffect(() => {
    const loadAISummary = async () => {
      try {
        setLoading(true);
        
        // If place has reviews, send to n8n for AI summarization
        if (place.reviews && place.reviews.length > 0) {
          console.log('🔄 Sending', place.reviews.length, 'reviews to n8n for AI summary');
          
          const data = await getAISummaryFromN8n(place, place.reviews);
          console.log('✅ Received AI summary from n8n:', data);

          // Only update summary if we got valid data from n8n
          if (data && data.length > 0 && data[0].output && data[0].output.text) {
            console.log('✅ Using real AI summary from n8n');
            
            // Clean up the text - remove markdown and extra formatting
            let cleanText = data[0].output.text;
            
            // Remove markdown bold (**text**)
            cleanText = cleanText.replace(/\*\*([^*]+)\*\*/g, '$1');
            
            // Remove markdown italic (*text*)
            cleanText = cleanText.replace(/\*([^*]+)\*/g, '$1');
            
            // Remove extra newlines
            cleanText = cleanText.replace(/\n\n+/g, '\n\n');
            
            // Parse the cleaned text into our summary format
            const summaryData = parseAISummaryText(cleanText, place);
            setSummary(summaryData);
            setError(null); // Clear any errors
          } else {
            console.log('⚠️ n8n response invalid, using demo summary');
            setError('n8n service returned invalid data. Using demo summary.');
          }
        } else {
          console.log('⚠️ No reviews available, using demo summary');
          setError('No reviews available for this place. Showing demo summary.');
        }
      } catch (err) {
        console.error('💥 Error loading AI summary from n8n:', err);
        setError('n8n service not available. Using demo AI summary.');
        // Keep using mock summary as fallback - don't change setSummary
      } finally {
        setLoading(false);
      }
    };

    loadAISummary();
  }, [place.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const renderPriceLevel = (level: number) => {
    return '$'.repeat(level);
  };

  const renderReview = (review: Review) => (
    <Paper key={review.id} elevation={1} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={{ fontSize: '1rem' }}>
          {review.authorName}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: '#FFD700' }}>
            {renderStars(review.rating)}
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {review.rating}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" paragraph>
        {review.text}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {review.relativeTimeDescription}
      </Typography>
    </Paper>
  );

  // Show loading state
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Generating AI Summary...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Analyzing {place.reviews?.length || 0} reviews with AI
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button 
        variant="outlined" 
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        ← Back to Search
      </Button>

      {/* Show error if n8n is not available */}
      {error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* 1. Place Info Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {place.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#FFD700' }}>
              {renderStars(place.rating)}
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {place.rating}
            </Typography>
            <Typography variant="h6" sx={{ color: '#00b894', fontWeight: 'bold' }}>
              {renderPriceLevel(place.priceLevel)}
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" paragraph>
            {place.address}
          </Typography>
          <Chip 
            label={place.type.replace('_', ' ').toUpperCase()} 
            color="primary" 
            variant="outlined"
          />
        </CardContent>
      </Card>

      {/* 2. AI Review Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            AI Review Summary
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Based on {summary.total_reviews} reviews
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
            <Typography variant="h3" sx={{ color: '#00b894' }}>
              {summary.overall_rating}/5
            </Typography>
            <Typography variant="h5" sx={{ color: '#FFD700' }}>
              {renderStars(summary.overall_rating)}
            </Typography>
          </Box>
          
          <Typography variant="body1" paragraph>
            {summary.sentiment_summary}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          {/* <Typography variant="h6" gutterBottom fontWeight="bold">
            Pros
          </Typography>
          {summary.pros.map((pro, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
              • {pro}
            </Typography>
          ))} */}
          
          {/* <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>
            Cons
          </Typography>
          {summary.cons.map((con, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
              • {con}
            </Typography>
          ))} */}
          
          {/* <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Recommendation
          </Typography>
          <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
            {summary.recommendation}
          </Typography> */}
        </CardContent>
      </Card>

      {/* 3. Chat Bot Button */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={<ChatIcon />}
        onClick={() => navigate('/chat', { state: { place } })}
        sx={{ mb: 3, py: 1.5 }}
      >
        Ask Questions About This Place
      </Button>

      {/* 4. Google Map */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Location
          </Typography>
          {place.location && place.location.latitude !== 0 && place.location.longitude !== 0 ? (
            <Box
              sx={{
                width: '100%',
                height: 300,
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <iframe
                title="Google Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.google.com/maps?q=${place.location.latitude},${place.location.longitude}&output=embed&z=15`}
              />
            </Box>
          ) : (
            <Box
              sx={{
                width: '100%',
                height: 300,
                backgroundColor: '#e0e0e0',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <Typography variant="body1" color="text.secondary">
                📍 {place.address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                (Map will display when location data is available)
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 5. Individual Reviews (Collapsed by Default) */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Customer Reviews
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {place.reviews?.length || 0} reviews
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowReviews(!showReviews)}
            >
              {showReviews ? 'Hide Reviews' : 'Show Reviews'}
            </Button>
          </Box>
          
          <Collapse in={showReviews}>
            {place.reviews && place.reviews.length > 0 ? (
              <>
                {(showAllReviews ? place.reviews : place.reviews.slice(0, 3)).map(renderReview)}
                
                {place.reviews.length > 3 && (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    sx={{ mt: 2 }}
                  >
                    {showAllReviews ? 'Show Less' : `Show All ${place.reviews.length} Reviews`}
                  </Button>
                )}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No reviews available for this place.
              </Typography>
            )}
          </Collapse>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PlaceDetailsPage;

