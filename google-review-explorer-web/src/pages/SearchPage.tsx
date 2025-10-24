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
  InputAdornment,
  Alert,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Place } from '../types';
import { mockSearchResults } from '../services/mockData';
import { searchPlaces, isApiKeyConfigured, resetAutocompleteSession, getPlaceDetailsWithReviews } from '../services/googlePlacesApi';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useGoogleApi] = useState(isApiKeyConfigured());
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  
  // Example searches to help users get started
  const exampleSearches = [
    { query: 'restaurant', icon: '🍽️', description: 'Find restaurants nearby' },
    { query: 'coffee shop', icon: '☕', description: 'Discover coffee shops' },
    { query: 'hotel', icon: '🏨', description: 'Search for hotels' },
  ];

  // Rate limiting: Check daily usage
  const checkRateLimit = (): boolean => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const storedDate = localStorage.getItem('searchDate');
    const storedCount = parseInt(localStorage.getItem('searchCount') || '0');

    // Reset count if it's a new day
    if (storedDate !== today) {
      localStorage.setItem('searchDate', today);
      localStorage.setItem('searchCount', '0');
      return true;
    }

    // Check if limit reached
    if (storedCount >= 10) {
      setRateLimitError('Daily limit reached (10 searches). Please try again tomorrow.');
      return false;
    }

    return true;
  };

  // Increment search count
  const incrementSearchCount = () => {
    const count = parseInt(localStorage.getItem('searchCount') || '0');
    localStorage.setItem('searchCount', (count + 1).toString());
  };

  // Get remaining searches
  const getRemainingSearches = (): number => {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('searchDate');
    const storedCount = parseInt(localStorage.getItem('searchCount') || '0');

    if (storedDate !== today) {
      return 10;
    }
    return Math.max(0, 10 - storedCount);
  };

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
        const results = mockSearchResults(query);
        setFilteredPlaces(results);
      }
    } catch (error) {
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
    // Check rate limit before loading place details (this is the expensive call)
    if (useGoogleApi && !checkRateLimit()) {
      return;
    }

    resetAutocompleteSession();
    
    if (useGoogleApi) {
      try {
        setLoading(true);
        
        // Increment count BEFORE API call
        incrementSearchCount();
        
        const placeWithReviews = await getPlaceDetailsWithReviews(place.id);
        
        if (placeWithReviews) {
          navigate('/place-details', { state: { place: placeWithReviews } });
        } else {
          navigate('/place-details', { state: { place } });
        }
      } catch (error) {
        navigate('/place-details', { state: { place } });
      } finally {
        setLoading(false);
      }
    } else {
      navigate('/place-details', { state: { place } });
    }
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
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: 600, mx: 'auto' }}>
              Search for any place and get AI-powered summaries of Google reviews in your preferred language
            </Typography>
            {useGoogleApi && (
              <Chip 
                label={`${getRemainingSearches()} searches remaining today`}
                color={getRemainingSearches() <= 3 ? 'warning' : 'success'}
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        )}

        {/* Rate Limit Error */}
        {rateLimitError && (
          <Alert severity="warning" onClose={() => setRateLimitError(null)} sx={{ mb: 2 }}>
            {rateLimitError}
          </Alert>
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
              backgroundColor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white !important',
                '&:hover': {
                  backgroundColor: 'white !important',
                },
                '&.Mui-focused': {
                  backgroundColor: 'white !important',
                },
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.87)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6200ea',
                },
              },
              '& .MuiOutlinedInput-input': {
                backgroundColor: 'white !important',
              },
              '& input': {
                backgroundColor: 'white !important',
                '&:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 100px white inset !important',
                  WebkitTextFillColor: 'default !important',
                },
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

        {/* Example Searches Section */}
        {!showDropdown && (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Try Searching For
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {exampleSearches.map((example, index) => (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    p: 2.5,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      elevation: 4,
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                      backgroundColor: 'primary.50'
                    }
                  }}
                  onClick={() => setSearchQuery(example.query)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h3" sx={{ fontSize: '2rem' }}>
                      {example.icon}
                    </Typography>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {example.query}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {example.description}
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

