import React, { useState } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Card, Paragraph, Title, Avatar, IconButton } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

interface Props {
  navigation: ChatScreenNavigationProp;
  route: ChatScreenRouteProp;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatScreen({ navigation, route }: Props) {
  const { place } = route.params;
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: `Hi! I'm your AI assistant. I can help you learn more about ${place.name} based on customer reviews. What would you like to know?`,
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');

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

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: getAIResponse(inputText),
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInputText('');
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.aiMessage]}>
      <View style={styles.messageHeader}>
        <Avatar.Icon 
          size={32} 
          icon={item.isUser ? 'account' : 'robot'} 
          style={[styles.avatar, item.isUser ? styles.userAvatar : styles.aiAvatar]}
        />
        <Paragraph style={styles.messageSender}>
          {item.isUser ? 'You' : 'AI Assistant'}
        </Paragraph>
      </View>
      <Card style={[styles.messageCard, item.isUser ? styles.userCard : styles.aiCard]}>
        <Card.Content>
          <Paragraph style={styles.messageText}>{item.text}</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );



  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Title style={styles.headerTitle}>Chat about {place.name}</Title>
            <Paragraph style={styles.headerSubtitle}>Ask me anything about this place!</Paragraph>
          </View>

          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContainer}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            mode="outlined"
            placeholder="Ask about reviews, food, service, etc..."
            value={inputText}
            onChangeText={setInputText}
            style={styles.textInput}
            multiline={false}
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
            returnKeyType="send"
          />
          <IconButton
            icon="send"
            mode="contained"
            onPress={sendMessage}
            disabled={!inputText.trim()}
            style={styles.sendButton}
            iconColor={inputText.trim() ? '#6200ea' : '#ccc'}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#6200ea',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
  },
  headerSubtitle: {
    color: 'white',
    opacity: 0.8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 8,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  avatar: {
    marginRight: 10,
  },
  userAvatar: {
    backgroundColor: '#6200ea',
  },
  aiAvatar: {
    backgroundColor: '#00b894',
  },
  messageSender: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageCard: {
    maxWidth: '85%',
    elevation: 2,
  },
  userCard: {
    backgroundColor: '#e3f2fd',
  },
  aiCard: {
    backgroundColor: '#ffffff',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'white',
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    margin: 0,
  },
});