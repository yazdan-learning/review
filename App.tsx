import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import { RootStackParamList } from './types';
import SearchScreen from './screens/SearchScreen';
import PlaceListScreen from './screens/PlaceListScreen';
import PlaceDetailsScreen from './screens/PlaceDetailsScreen';
import ChatScreen from './screens/ChatScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Search"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6200ea',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Search" 
            component={SearchScreen}
            options={{ 
              title: 'Places Search',
              headerStyle: {
                backgroundColor: '#6200ea',
              },
            }}
          />
          <Stack.Screen 
            name="PlaceList" 
            component={PlaceListScreen}
            options={{ 
              title: 'Search Results',
            }}
          />
          <Stack.Screen 
            name="PlaceDetails" 
            component={PlaceDetailsScreen}
            options={{ 
              title: 'Place Details',
            }}
          />
          <Stack.Screen 
            name="Chat" 
            component={ChatScreen}
            options={{ 
              title: 'AI Assistant',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
