import React from 'react';
import { Container, Typography, Box, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button 
        variant="outlined" 
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        ← Back to Home
      </Button>

      <Typography variant="h3" gutterBottom fontWeight="bold">
        Privacy Policy
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Last Updated: {new Date().toLocaleDateString()}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ '& h5': { mt: 3, mb: 2, fontWeight: 'bold' }, '& p': { mb: 2 } }}>
        
        <Typography variant="h5">1. Introduction</Typography>
        <Typography variant="body1">
          Welcome to our Place Review Explorer application ("Service"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information when you use our Service.
        </Typography>

        <Typography variant="h5">2. Information We Collect</Typography>
        <Typography variant="body1" fontWeight="bold">2.1 Information You Provide:</Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Search queries (place names, locations)</li>
            <li>Language preferences for AI summaries</li>
          </ul>
        </Typography>

        <Typography variant="body1" fontWeight="bold" sx={{ mt: 2 }}>2.2 Automatically Collected Information:</Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Usage data (search count, timestamps)</li>
            <li>IP address (for rate limiting purposes)</li>
          </ul>
        </Typography>

        <Typography variant="body1" fontWeight="bold" sx={{ mt: 2 }}>2.3 Strictly Necessary Cookies:</Typography>
        <Typography variant="body1">
          We use browser local storage (strictly necessary cookies) for essential service functionality:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Rate limiting (required):</strong> Track daily search limits (10 searches per day) to prevent abuse and ensure service availability for all users</li>
            <li><strong>Preferences (optional):</strong> Store your language preference</li>
            <li><strong>Acknowledgment:</strong> Remember that you've seen the cookie notice</li>
          </ul>
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>Legal Basis:</strong> Rate limiting cookies are strictly necessary under GDPR Article 6(1)(f) (legitimate interest) and do not require your consent. These cookies are essential for the service to function properly and prevent abuse.
        </Typography>

        <Typography variant="h5">3. How We Use Your Information</Typography>
        <Typography variant="body1">
          We use the collected information for:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Providing place search and review summary services</li>
            <li>Generating AI-powered review summaries in your preferred language</li>
            <li>Rate limiting to prevent abuse and control costs</li>
            <li>Improving our Service</li>
            <li>Complying with legal obligations</li>
          </ul>
        </Typography>

        <Typography variant="h5">4. Third-Party Services</Typography>
        <Typography variant="body1">
          Our Service uses the following third-party services that may collect and process your data:
        </Typography>

        <Typography variant="body1" fontWeight="bold" sx={{ mt: 2 }}>4.1 Google Places API:</Typography>
        <Typography variant="body1">
          We use Google Places API to search for places and retrieve reviews. Your search queries and selected places are sent to Google. Google's privacy policy applies: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>
        </Typography>

        <Typography variant="body1" fontWeight="bold" sx={{ mt: 2 }}>4.2 Groq AI:</Typography>
        <Typography variant="body1">
          We use Groq AI (via our n8n backend) to generate review summaries. Place reviews and your language preference are sent to Groq for processing. Groq does not permanently store this data. Groq's privacy policy applies: <a href="https://groq.com/privacy-policy/" target="_blank" rel="noopener noreferrer">https://groq.com/privacy-policy/</a>
        </Typography>

        <Typography variant="body1" fontWeight="bold" sx={{ mt: 2 }}>4.3 Google Maps:</Typography>
        <Typography variant="body1">
          We embed Google Maps to display place locations. Google may collect data through this embed. Google's privacy policy applies.
        </Typography>

        <Typography variant="h5">5. Data Retention</Typography>
        <Typography variant="body1">
          <ul>
            <li><strong>Search queries:</strong> Not stored permanently. Only used for real-time API requests.</li>
            <li><strong>Local storage data:</strong> Stored in your browser until you clear it or after 24 hours (for rate limiting).</li>
            <li><strong>AI summaries:</strong> Not stored by us. May be temporarily cached by n8n for performance.</li>
          </ul>
        </Typography>

        <Typography variant="h5">6. Your Rights</Typography>
        <Typography variant="body1">
          You have the right to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Access:</strong> Request information about data we hold about you</li>
            <li><strong>Deletion:</strong> Clear your browser's local storage at any time</li>
            <li><strong>Object:</strong> Stop using our Service if you disagree with our practices</li>
            <li><strong>Withdraw consent:</strong> Clear cookies and stop using the Service</li>
          </ul>
        </Typography>

        <Typography variant="h5">7. Data Security</Typography>
        <Typography variant="body1">
          We implement appropriate security measures to protect your data:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>HTTPS encryption for all data transmission</li>
            <li>No permanent storage of personal data</li>
            <li>Rate limiting to prevent abuse</li>
            <li>Secure API key management</li>
          </ul>
        </Typography>

        <Typography variant="h5">8. Children's Privacy</Typography>
        <Typography variant="body1">
          Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
        </Typography>

        <Typography variant="h5">9. International Data Transfers</Typography>
        <Typography variant="body1">
          Your data may be transferred to and processed in countries other than your own, including the United States, where Google and Groq operate their services.
        </Typography>

        <Typography variant="h5">10. Changes to This Privacy Policy</Typography>
        <Typography variant="body1">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
        </Typography>

        <Typography variant="h5">11. Contact Us</Typography>
        <Typography variant="body1">
          If you have any questions about this Privacy Policy, please contact us at:
        </Typography>
        <Typography variant="body1">
          Email: [Your Email Address]
        </Typography>

        <Typography variant="h5">12. GDPR Compliance (EU Users)</Typography>
        <Typography variant="body1">
          If you are located in the European Economic Area (EEA), you have additional rights under GDPR:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Right to access your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
          </ul>
        </Typography>

        <Typography variant="h5">13. California Privacy Rights (CCPA)</Typography>
        <Typography variant="body1">
          If you are a California resident, you have the right to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Know what personal information is collected</li>
            <li>Know whether your personal information is sold or disclosed</li>
            <li>Say no to the sale of personal information</li>
            <li>Access your personal information</li>
            <li>Request deletion of your personal information</li>
          </ul>
        </Typography>
        <Typography variant="body1">
          <strong>Note:</strong> We do not sell your personal information.
        </Typography>

      </Box>
    </Container>
  );
};

export default PrivacyPolicyPage;

