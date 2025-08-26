import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import ArenaListScreen from '../screens/ArenaListScreen';
import CalendarScreen from '../screens/CalendarScreen';
import QuadraSelectionScreen from '../screens/QuadraSelectionScreen';
import HourSelectionScreen from '../screens/HourSelectionScreen';
import VideoListScreen from '../screens/VideoListScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';

// Importando a interface VideoMoment para garantir a consistência dos tipos
import { VideoMoment } from '../types/sportftv'; 

// A tela FilteredVideosScreen foi removida das importações

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  ArenaList: undefined;
  Calendar: {
    arenaId: string;
    arenaName: string;
  };
  QuadraSelection: {
    arenaId: string;
    arenaName: string;
    selectedDate: string;
  };
  HourSelection: {
    arenaId: string;
    arenaName: string;
    selectedDate: string;
    quadraId: string;
    quadraName: string;
  };
  VideoList: {
    arenaId: string;
    arenaName: string;
    selectedDate: string;
    quadraId: string;
    quadraName: string;
    selectedHour: number;
    videoCount?: number; // Adicionado como opcional para flexibilidade
  };
  VideoPlayer: {
    video: VideoMoment; 
  };
  // A rota FilteredVideos foi REMOVIDA daqui
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#1e3a8a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // A linha 'headerBackTitleVisible: false' foi removida.
          // O comportamento padrão já é suficiente na maioria dos casos.
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ArenaList" component={ArenaListScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="QuadraSelection" component={QuadraSelectionScreen} />
        <Stack.Screen name="HourSelection" component={HourSelectionScreen} />
        <Stack.Screen name="VideoList" component={VideoListScreen} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
        
        {/* A linha <Stack.Screen name="FilteredVideos".../> foi REMOVIDA daqui */}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;