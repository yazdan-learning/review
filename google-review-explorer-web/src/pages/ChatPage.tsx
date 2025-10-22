import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  IconButton,
  Box,
  Avatar,
  Button
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Place, Message } from '../types';

const ChatPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { place } = location.state as { place: Place };
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi! I'm your AI assistant. I can help you learn more about ${place.name} based on customer reviews. What would you like to know?`,
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI responses based on common questions
  const getAIResponse = (userQuestion: string): string => {
    const question = userQuestion.toLowerCase();
    
    if (question.includes('food') || question.includes('menu') || question.includes('dish')) {
      return "Based on reviews, customers frequently praise the pasta dishes and Italian cuisine. The food quality is consistently rated highly, with many mentioning perfectly cooked pasta and authentic flavors. However, some note that portions could be larger for the price point.";
    }
    
    if (question.includes('service') || question.includes('staff') || question.includes('waiter')) {
      return "Reviews indicate that the staff is generally friendly and knowledgeable. Most customers appreciate the attentive service, though a few reviews mention that service can be slower during peak hours. The staff seems well-trained in explaining menu items.";
    }
    
    if (question.includes('price') || question.includes('cost') || question.includes('expensive')) {
      return "The restaurant is considered moderately to highly priced. Customers generally feel the quality justifies the cost, especially for special occasions. Many reviews suggest it's worth the price for the quality and atmosphere, but might not be suitable for casual everyday dining.";
    }
    
    if (question.includes('atmosphere') || question.includes('ambiance') || question.includes('romantic')) {
      return "The atmosphere is consistently praised as romantic and intimate. Customers frequently recommend it for special occasions, date nights, and celebrations. The lighting and decor create a cozy, upscale dining environment that many find perfect for romantic dinners.";
    }
    
    if (question.includes('parking') || question.includes('location') || question.includes('access')) {
      return "The location is convenient and central, but parking can be challenging. Several reviews mention limited parking availability. Many customers recommend using public transportation or ride-sharing services when visiting.";
    }
    
    if (question.includes('reservation') || question.includes('wait') || question.includes('busy')) {
      return "Based on reviews, reservations are highly recommended, especially for dinner and weekends. Customers who made reservations had positive experiences, while those without sometimes faced longer wait times. The restaurant appears to be consistently busy.";
    }
    
    if (question.includes('recommend') || question.includes('should i') || question.includes('worth')) {
      return "Based on the overall sentiment, I'd recommend this place for special occasions and romantic dinners. The quality of food and atmosphere consistently receives praise. However, consider the higher price point and make reservations in advance for the best experience.";
    }
    
    return "That's an interesting question! Based on the available reviews, customers generally have positive experiences at this place. The quality and atmosphere are consistently praised, though some mention the higher price point. Would you like me to elaborate on any specific aspect like food, service, or atmosphere?";
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getAIResponse(inputText),
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', py: 2 }}>
      <Button 
        variant="outlined" 
        onClick={() => navigate('/place-details', { state: { place } })}
        sx={{ mb: 2, alignSelf: 'flex-start' }}
      >
        ← Back to Details
      </Button>

      <Paper elevation={3} sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ bgcolor: '#6200ea', color: 'white', p: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Chat about {place.name}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Ask me anything about this place!
          </Typography>
        </Box>

        {/* Messages Area */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                flexDirection: message.isUser ? 'row-reverse' : 'row',
                mb: 2,
                alignItems: 'flex-start'
              }}
            >
              <Avatar
                sx={{
                  bgcolor: message.isUser ? '#6200ea' : '#00b894',
                  mx: 1
                }}
              >
                {message.isUser ? <PersonIcon /> : <SmartToyIcon />}
              </Avatar>
              <Box sx={{ maxWidth: '70%' }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mb: 0.5,
                    color: 'text.secondary',
                    textAlign: message.isUser ? 'right' : 'left'
                  }}
                >
                  {message.isUser ? 'You' : 'AI Assistant'}
                </Typography>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    bgcolor: message.isUser ? '#e3f2fd' : 'white',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>
                </Paper>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Ask about reviews, food, service, etc..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size="small"
              multiline
              maxRows={3}
            />
            <IconButton
              color="primary"
              onClick={sendMessage}
              disabled={!inputText.trim()}
              sx={{
                bgcolor: inputText.trim() ? '#6200ea' : 'grey.300',
                color: 'white',
                '&:hover': {
                  bgcolor: inputText.trim() ? '#5200ca' : 'grey.400',
                },
                '&:disabled': {
                  bgcolor: 'grey.300',
                  color: 'white'
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatPage;

