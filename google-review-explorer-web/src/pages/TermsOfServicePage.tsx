import React from 'react';
import { Container, Typography, Box, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TermsOfServicePage: React.FC = () => {
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
        Terms of Service
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Last Updated: {new Date().toLocaleDateString()}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ '& h5': { mt: 3, mb: 2, fontWeight: 'bold' }, '& p': { mb: 2 } }}>
        
        <Typography variant="h5">1. Acceptance of Terms</Typography>
        <Typography variant="body1">
          By accessing and using Place Review Explorer ("Service"), you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, please do not use our Service.
        </Typography>

        <Typography variant="h5">2. Description of Service</Typography>
        <Typography variant="body1">
          Place Review Explorer is a web application that allows users to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Search for places (restaurants, hotels, cafes, etc.) using Google Places API</li>
            <li>View place details including ratings, addresses, and locations</li>
            <li>Access AI-generated summaries of Google reviews in multiple languages</li>
            <li>Interact with an AI chatbot to ask questions about places</li>
          </ul>
        </Typography>

        <Typography variant="h5">3. User Obligations</Typography>
        <Typography variant="body1">
          You agree to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Use the Service only for lawful purposes</li>
            <li>Not attempt to bypass rate limits or security measures</li>
            <li>Not use automated tools (bots, scrapers) to access the Service</li>
            <li>Not misuse, abuse, or overload the Service</li>
            <li>Not attempt to reverse engineer or copy the Service</li>
            <li>Respect the intellectual property rights of the Service and third parties</li>
          </ul>
        </Typography>

        <Typography variant="h5">4. Rate Limits and Usage Restrictions</Typography>
        <Typography variant="body1">
          To ensure fair usage and control costs, we implement the following limits:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>10 place detail requests per day</strong> per user/browser</li>
            <li>Unlimited autocomplete searches</li>
          </ul>
        </Typography>
        <Typography variant="body1">
          These limits may be adjusted at our discretion. Attempting to bypass these limits may result in service termination.
        </Typography>

        <Typography variant="h5">5. Third-Party Services</Typography>
        <Typography variant="body1">
          Our Service relies on third-party services:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li><strong>Google Places API:</strong> Subject to Google's Terms of Service</li>
            <li><strong>Groq AI:</strong> Subject to Groq's Terms of Service</li>
            <li><strong>Google Maps:</strong> Subject to Google Maps Terms of Service</li>
          </ul>
        </Typography>
        <Typography variant="body1">
          You agree to comply with all applicable third-party terms when using our Service.
        </Typography>

        <Typography variant="h5">6. Intellectual Property</Typography>
        <Typography variant="body1">
          <strong>6.1 Our Content:</strong> The Service, including its design, code, and original content, is owned by us and protected by copyright and other intellectual property laws.
        </Typography>
        <Typography variant="body1">
          <strong>6.2 Third-Party Content:</strong> Place data, reviews, and maps are provided by Google and remain their property. AI-generated summaries are created using Groq AI.
        </Typography>
        <Typography variant="body1">
          <strong>6.3 User License:</strong> We grant you a limited, non-exclusive, non-transferable license to use the Service for personal, non-commercial purposes.
        </Typography>

        <Typography variant="h5">7. Disclaimer of Warranties</Typography>
        <Typography variant="body1">
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Accuracy, reliability, or completeness of place data or AI summaries</li>
            <li>Uninterrupted or error-free operation</li>
            <li>Fitness for a particular purpose</li>
            <li>Non-infringement of third-party rights</li>
          </ul>
        </Typography>
        <Typography variant="body1">
          We do not guarantee that AI-generated summaries are accurate or complete. Always verify information independently.
        </Typography>

        <Typography variant="h5">8. Limitation of Liability</Typography>
        <Typography variant="body1">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Any indirect, incidental, special, or consequential damages</li>
            <li>Loss of profits, data, or business opportunities</li>
            <li>Damages resulting from your use or inability to use the Service</li>
            <li>Damages resulting from reliance on AI-generated summaries</li>
            <li>Damages caused by third-party services (Google, Groq)</li>
          </ul>
        </Typography>
        <Typography variant="body1">
          Our total liability shall not exceed the amount you paid to use the Service (currently $0).
        </Typography>

        <Typography variant="h5">9. Indemnification</Typography>
        <Typography variant="body1">
          You agree to indemnify and hold us harmless from any claims, damages, losses, or expenses (including legal fees) arising from:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights</li>
            <li>Your violation of applicable laws</li>
          </ul>
        </Typography>

        <Typography variant="h5">10. Service Availability</Typography>
        <Typography variant="body1">
          We reserve the right to:
        </Typography>
        <Typography variant="body1" component="div">
          <ul>
            <li>Modify, suspend, or discontinue the Service at any time</li>
            <li>Change rate limits or usage restrictions</li>
            <li>Refuse service to anyone for any reason</li>
            <li>Terminate accounts that violate these Terms</li>
          </ul>
        </Typography>
        <Typography variant="body1">
          We are not liable for any modification, suspension, or discontinuation of the Service.
        </Typography>

        <Typography variant="h5">11. Privacy</Typography>
        <Typography variant="body1">
          Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand our data practices.
        </Typography>

        <Typography variant="h5">12. Changes to Terms</Typography>
        <Typography variant="body1">
          We may modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Service after changes constitutes acceptance of the modified Terms.
        </Typography>

        <Typography variant="h5">13. Governing Law</Typography>
        <Typography variant="body1">
          These Terms shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
        </Typography>

        <Typography variant="h5">14. Dispute Resolution</Typography>
        <Typography variant="body1">
          Any disputes arising from these Terms or your use of the Service shall be resolved through:
        </Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>Good faith negotiation between the parties</li>
            <li>Mediation if negotiation fails</li>
            <li>Binding arbitration or courts of [Your Jurisdiction] if mediation fails</li>
          </ol>
        </Typography>

        <Typography variant="h5">15. Severability</Typography>
        <Typography variant="body1">
          If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
        </Typography>

        <Typography variant="h5">16. Entire Agreement</Typography>
        <Typography variant="body1">
          These Terms, together with our Privacy Policy, constitute the entire agreement between you and us regarding the Service.
        </Typography>

        <Typography variant="h5">17. Contact Information</Typography>
        <Typography variant="body1">
          For questions about these Terms, please contact us at:
        </Typography>
        <Typography variant="body1">
          Email: [Your Email Address]
        </Typography>

        <Typography variant="h5">18. Acknowledgment</Typography>
        <Typography variant="body1">
          By using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </Typography>

      </Box>
    </Container>
  );
};

export default TermsOfServicePage;

