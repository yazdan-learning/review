import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import SearchPage from './pages/SearchPage';
import PlaceDetailsPage from './pages/PlaceDetailsPage';
import ChatPage from './pages/ChatPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookieConsent from './components/CookieConsent';
import Footer from './components/Footer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea',
    },
    secondary: {
      main: '#00b894',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/place-details" element={<PlaceDetailsPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
            </Routes>
          </Box>
          <Footer />
          <CookieConsent />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;

