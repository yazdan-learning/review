import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Link, Backdrop } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already acknowledged
    const acknowledged = localStorage.getItem('cookieConsent');
    
    if (!acknowledged) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    // User acknowledges the use of strictly necessary cookies
    localStorage.setItem('cookieConsent', 'acknowledged');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <>
      {/* Backdrop to block interaction with the page */}
      <Backdrop
        open={showBanner}
        sx={{
          zIndex: 9998,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
      />
      
      {/* Cookie Notice Banner */}
      <Paper
        elevation={6}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 3,
          backgroundColor: 'white',
          borderTop: '3px solid #6200ea',
          zIndex: 9999,
        }}
      >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            🍪 Cookie Notice
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This service uses <strong>strictly necessary cookies</strong> for rate limiting (10 searches per day) to prevent abuse and ensure service availability for all users. 
            These cookies are essential for the service to function and do not require your consent under GDPR Article 6(1)(f) (legitimate interest).
            <br /><br />
            We also use Google Places API and Groq AI to provide our services. By using this service, you agree to our use of these third-party services.
            {' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/privacy')}
              sx={{ textDecoration: 'underline', cursor: 'pointer' }}
            >
              Learn more in our Privacy Policy
            </Link>
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            minWidth: { xs: '100%', sm: 'auto' },
          }}
        >
          <Button
            variant="contained"
            onClick={handleAccept}
            sx={{ minWidth: 150 }}
          >
            I Understand
          </Button>
        </Box>
      </Box>
    </Paper>
    </>
  );
};

export default CookieConsent;

