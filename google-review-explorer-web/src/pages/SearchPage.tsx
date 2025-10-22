import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Place } from '../types';
import { mockPlaces, mockSearchResults } from '../services/mockData';
import { searchPlaces, isApiKeyConfigured, resetAutocompleteSession, getPlaceDetailsWithReviews } from '../services/googlePlacesApi';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useGoogleApi] = useState(isApiKeyConfigured());
  
  const popularPlaces = mockPlaces.slice(0, 3);

  const handleSearch = useCallback(async (query: string) => {
    if (query.trim().length === 0) {
      setFilteredPlaces([]);
      setShowDropdown(false);
      return;
    }

    // Autocomplete works better with 2+ characters
    if (query.trim().length < 2) {
      return;
    }

    setLoading(true);
    setShowDropdown(true);

    try {
      if (useGoogleApi) {
        const results = await searchPlaces(query);
        setFilteredPlaces(results);
      } else {
        // Use mock data
        const results = mockSearchResults(query);
        setFilteredPlaces(results);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to mock data on error
      const results = mockSearchResults(query);
      setFilteredPlaces(results);
    } finally {
      setLoading(false);
    }
  }, [useGoogleApi]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  const handlePlaceSelect = async (place: Place) => {
    // Reset autocomplete session (ends the session for billing)
    resetAutocompleteSession();
    
    // Load reviews from Google API if using real API
    if (useGoogleApi) {
      try {
        setLoading(true);
        console.log('📍 Loading place details with reviews:', place.name);
        
        // Get full place details including reviews
        const placeWithReviews = await getPlaceDetailsWithReviews(place.id);
        
        if (placeWithReviews) {
          console.log('✅ Loaded', placeWithReviews.reviews?.length || 0, 'reviews');
          // Navigate with full place data including reviews
          navigate('/place-details', { state: { place: placeWithReviews } });
        } else {
          // Fallback to autocomplete data
          navigate('/place-details', { state: { place } });
        }
      } catch (error) {
        console.error('Error loading place with reviews:', error);
        // Navigate with autocomplete data on error
        navigate('/place-details', { state: { place } });
      } finally {
        setLoading(false);
      }
    } else {
      // Use mock data
      console.log('📍 Navigating with mock data:', place.name);
      navigate('/place-details', { state: { place } });
    }
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.round(rating));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header Section */}
        {!showDropdown && (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom color="primary" fontWeight="bold">
              Find Places & Reviews
            </Typography>
            <Chip 
              label={useGoogleApi ? '🌐 Using Google API' : '📱 Using Demo Data'}
              color={useGoogleApi ? 'success' : 'default'}
              sx={{ mt: 1 }}
            />
          </Box>
        )}

        {/* Search Section */}
        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            placeholder={useGoogleApi ? "Search real places worldwide..." : "Search demo places..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.trim().length > 0) {
                setShowDropdown(true);
              }
            }}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'white'
              }
            }}
          />

          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Searching places...
              </Typography>
            </Box>
          )}

          {/* Dropdown Results */}
          {showDropdown && filteredPlaces.length > 0 && !loading && (
            <Paper
              elevation={3}
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                maxHeight: 500,
                overflowY: 'auto',
                zIndex: 1000,
                mt: 1,
              }}
            >
              <List>
                {filteredPlaces.map((place, index) => (
                  <React.Fragment key={place.id}>
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handlePlaceSelect(place)}>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" fontWeight="bold">
                              {place.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {place.address}
                            </Typography>
                          </Box>
                          {place.rating > 0 && (
                            <Box sx={{ ml: 2 }}>
                              <Typography variant="body2">
                                ⭐ {place.rating}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </ListItemButton>
                    </ListItem>
                    {index < filteredPlaces.length - 1 && <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ p: 1, backgroundColor: 'grey.100', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Showing {filteredPlaces.length} results
                </Typography>
              </Box>
            </Paper>
          )}

          {showDropdown && filteredPlaces.length === 0 && !loading && searchQuery.trim().length > 2 && (
            <Paper elevation={3} sx={{ mt: 1, p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No places found for "{searchQuery}"
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Popular Places Section */}
        {!showDropdown && (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Popular Places
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {popularPlaces.map((place) => (
                <Paper
                  key={place.id}
                  elevation={2}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      elevation: 4,
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => handlePlaceSelect(place)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {place.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {place.address}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={place.type.replace('_', ' ').toUpperCase()}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    <Box sx={{ ml: 2, textAlign: 'right' }}>
                      <Typography variant="body1">
                        {renderStars(place.rating)}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {place.rating}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SearchPage;

