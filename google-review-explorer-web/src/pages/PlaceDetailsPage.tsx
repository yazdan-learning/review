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
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import TranslateIcon from '@mui/icons-material/Translate';
import { Place, ReviewSummary } from '../types';
import { getAISummaryFromN8n } from '../services/googlePlacesApi';

// Helper function to parse AI text into structured summary
const parseAISummaryText = (text: string, place: Place): ReviewSummary => {
  // The AI text is a paragraph summary from n8n
  return {
    overall_rating: place.rating || 4.0,
    total_reviews: place.reviews?.length || 0,
    sentiment_summary: text.trim(),
    pros: [],
    cons: [],
    key_themes: [],
    recommendation: ""
  };
};

// Available languages for AI summary
const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'fa', name: 'Persian (Farsi)', flag: '🇮🇷' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿' },
];

const PlaceDetailsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { place: initialPlace } = location.state as { place: Place };
  const [place] = useState<Place>(initialPlace);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  // Send reviews to n8n for AI summarization when language changes
  useEffect(() => {
    const loadAISummary = async () => {
      try {
        setLoading(true);
        
        // If place has reviews, send to n8n for AI summarization
        if (place.reviews && place.reviews.length > 0) {
          const data = await getAISummaryFromN8n(place, place.reviews, selectedLanguage);

          // Only update summary if we got valid data from n8n
          if (data && data.length > 0 && data[0].output && data[0].output.text) {
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
            setError('AI service returned invalid data. Please try again later.');
          }
        } else {
          setError('No reviews available for this place.');
        }
      } catch (err) {
        setError('AI service is currently unavailable. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadAISummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place.id, selectedLanguage]); // Re-run when language changes

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const renderPriceLevel = (level: number) => {
    return '$'.repeat(level);
  };

  // Show loading state
  if (loading && !error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Generating AI Summary...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Analyzing {place.reviews?.length || 0} reviews
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
        <Alert severity="error" sx={{ mb: 2 }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={place.type.replace('_', ' ').toUpperCase()} 
              color="primary" 
              variant="outlined"
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              Data from Google Places API
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* 2. AI Review Summary - Only show if successfully loaded */}
      {summary && !error ? (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  AI Review Summary
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Based on {place.userRatingCount ? place.userRatingCount.toLocaleString() : summary.total_reviews} reviews
                </Typography>
              </Box>
              
              {/* Language Selector */}
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="language-select-label">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TranslateIcon fontSize="small" />
                    Language
                  </Box>
                </InputLabel>
                <Select
                  labelId="language-select-label"
                  id="language-select"
                  value={selectedLanguage}
                  label="Language"
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  disabled={loading}
                >
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontSize: '1.2em' }}>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
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
          </CardContent>
        </Card>
      ) : null}

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

      {/* 5. View All Reviews on Google */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Customer Reviews
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {place.userRatingCount 
                  ? `${place.userRatingCount.toLocaleString()} reviews on Google Maps`
                  : 'See all reviews on Google Maps'}
              </Typography>
            </Box>
          </Box>
          
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={() => {
              // Generate Google Maps URL with place details
              const googleMapsUrl = place.id 
                ? `https://www.google.com/maps/place/?q=place_id:${place.id}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}`;
              
              // Open in new tab
              window.open(googleMapsUrl, '_blank');
            }}
            sx={{ 
              py: 1.5,
              backgroundColor: '#4285f4', // Google blue
              '&:hover': {
                backgroundColor: '#357ae8'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: '1.2em' }}>📍</span>
              <span>View All Reviews on Google Maps</span>
            </Box>
          </Button>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
            Opens Google Maps in a new tab
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PlaceDetailsPage;

