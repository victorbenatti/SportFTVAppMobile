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
import FilteredVideosScreen from '../screens/FilteredVideosScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';

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
    videoCount: number;
  };
  FilteredVideos: {
    arena: {
      id: string;
      name: string;
    };
    selectedDate: string;
    quadra: {
      id: string;
      name: string;
    };
    selectedHour: number;
  };
  VideoPlayer: {
    video: {
      id: string;
      title: string;
      description: string;
      thumbnailUrl: string;
      videoUrl: string;
      duration: string;
      date: string;
      tournament: string;
      views: string;
    };
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1e3a8a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Login' }}
        />
        <Stack.Screen 
          name="ArenaList" 
          component={ArenaListScreen} 
          options={{ title: 'Escolha uma Arena' }}
        />
        <Stack.Screen 
          name="Calendar" 
          component={CalendarScreen} 
          options={({ route }) => ({ 
            title: route.params.arenaName 
          })}
        />
        <Stack.Screen 
          name="QuadraSelection" 
          component={QuadraSelectionScreen} 
          options={{ title: 'Escolha a Quadra' }}
        />
        <Stack.Screen 
          name="HourSelection" 
          component={HourSelectionScreen} 
          options={{ title: 'Escolha o Horário' }}
        />
        <Stack.Screen 
          name="VideoList" 
          component={VideoListScreen} 
          options={{ title: 'Vídeos Encontrados' }}
        />
        <Stack.Screen 
          name="FilteredVideos" 
          component={FilteredVideosScreen} 
          options={{ title: 'Melhores Momentos' }}
        />
        <Stack.Screen 
          name="VideoPlayer" 
          component={VideoPlayerScreen} 
          options={{ title: 'Reproduzir Vídeo' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;