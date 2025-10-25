import React, { useState } from 'react';
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
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import TranslateIcon from '@mui/icons-material/Translate';
import { Place } from '../types';

// Available languages for display
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
  // 🔧 Language selector state - ready for Groq
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  // Check if Google's AI summary is available
  const hasGoogleAISummary = place.googleReviewSummary && place.googleReviewSummary.text;
  
  // 🔧 NOTE: When using Google AI, language is auto-determined
  // To enable language selection, switch back to Groq (see comments in code)


  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const renderPriceLevel = (level: number) => {
    return '$'.repeat(level);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button 
        variant="outlined" 
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        ← Back to Search
      </Button>

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

      {/* AI Review Summary Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {hasGoogleAISummary && place.googleReviewSummary ? (
            // Google AI Summary Available
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  AI Review Summary
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Based on {place.userRatingCount ? place.userRatingCount.toLocaleString() : 'customer'} reviews
                </Typography>
              </Box>
              
              {/* 🔧 COMMENTED OUT: Language Selector (for future use with Groq)
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    AI Review Summary
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Based on {place.userRatingCount ? place.userRatingCount.toLocaleString() : 'customer'} reviews
                  </Typography>
                </Box>
                
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
              */}
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
                <Typography variant="h3" sx={{ color: '#00b894' }}>
                  {place.rating}/5
                </Typography>
                <Typography variant="h5" sx={{ color: '#FFD700' }}>
                  {renderStars(place.rating)}
                </Typography>
              </Box>
              
              {/* AI-generated summary text */}
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                {place.googleReviewSummary.text}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              {/* ⚠️ MANDATORY: Google Attribution */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  {place.googleReviewSummary.disclosureText}
                </Typography>
                
                {/* ⚠️ MANDATORY: Link to full reviews */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    href={place.googleReviewSummary.reviewsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View All Reviews on Google Maps
                  </Button>
                  
                  {/* ⚠️ MANDATORY: Report inappropriate content */}
                  <Button 
                    variant="text" 
                    size="small"
                    href={place.googleReviewSummary.flagContentUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="error"
                  >
                    Report Inappropriate Content
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            // Summary Not Available
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  AI Review Summary
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Based on {place.userRatingCount ? place.userRatingCount.toLocaleString() : 'customer'} reviews
                </Typography>
              </Box>
              
              <Alert severity="info">
                AI summary is not available for this location. This feature is currently supported only in the United States, United Kingdom, Japan, Brazil, India, and select Latin American countries.
              </Alert>
              
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  href={`https://www.google.com/maps/place/?q=place_id:${place.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View All Reviews on Google Maps
                </Button>
              </Box>
            </>
          )}
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

