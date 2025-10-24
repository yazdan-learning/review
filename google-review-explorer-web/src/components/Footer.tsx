import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Left side - Copyright and Attribution */}
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Place Review Explorer. All rights reserved.
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
              Powered by Google Places API and Groq AI
            </Typography>
          </Box>

          {/* Right side - Links */}
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/privacy')}
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  color: 'primary.main',
                },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/terms')}
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  color: 'primary.main',
                },
              }}
            >
              Terms of Service
            </Link>
            <Link
              href="mailto:your-email@example.com"
              variant="body2"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  color: 'primary.main',
                },
              }}
            >
              Contact
            </Link>
          </Box>
        </Box>

        {/* Google Attribution */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Place data and reviews provided by{' '}
            <Link
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'primary.main' }}
            >
              Google Maps Platform
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

