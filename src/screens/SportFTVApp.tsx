import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import ArenaListScreen from './ArenaListScreen';
import CalendarScreen from './CalendarScreen';
import QuadraSelectionScreen from './QuadraSelectionScreen';
import HourSelectionScreen from './HourSelectionScreen';
import FilteredVideosScreen from './FilteredVideosScreen';
import VideoPlayerScreen from './VideoPlayerScreen';

type Screen = 'home' | 'login' | 'arenas' | 'calendar' | 'quadras' | 'hours' | 'videos' | 'player';

interface User {
  email: string;
  name: string;
  isLoggedIn: boolean;
}

interface AppState {
  currentScreen: Screen;
  user: User;
  selectedArena?: {
    id: string;
    name: string;
  };
  selectedDate?: string;
  selectedQuadra?: {
    id: string;
    name: string;
  };
  selectedHour?: number;
  selectedVideo?: {
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
}

const SportFTVApp = () => {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'home',
    user: {
      email: '',
      name: '',
      isLoggedIn: false
    }
  });

  // Navegação para vídeos (verifica se está logado)
  const handleNavigateToVideos = () => {
    if (appState.user.isLoggedIn) {
      setAppState({
        ...appState,
        currentScreen: 'arenas'
      });
    } else {
      setAppState({
        ...appState,
        currentScreen: 'login'
      });
    }
  };

  // Navegação para login
  const handleNavigateToLogin = () => {
    setAppState({
      ...appState,
      currentScreen: 'login'
    });
  };

  // Login do usuário
  const handleLogin = (email: string, name: string) => {
    setAppState({
      ...appState,
      currentScreen: 'arenas',
      user: {
        email,
        name,
        isLoggedIn: true
      }
    });
  };

  // Seleção de arena
  const handleSelectArena = (arena: any) => {
    setAppState({
      ...appState,
      currentScreen: 'calendar',
      selectedArena: {
        id: arena.id,
        name: arena.name
      }
    });
  };

  // Seleção de data
  const handleSelectDate = (date: string) => {
    setAppState({
      ...appState,
      currentScreen: 'quadras',
      selectedDate: date
    });
  };

  // Seleção de quadra
  const handleSelectQuadra = (quadra: any) => {
    setAppState({
      ...appState,
      currentScreen: 'hours',
      selectedQuadra: {
        id: quadra.id,
        name: quadra.name
      }
    });
  };

  // Seleção de horário
  const handleSelectHour = (hour: number) => {
    setAppState({
      ...appState,
      currentScreen: 'videos',
      selectedHour: hour
    });
  };

  // Abrir player de vídeo
  const handleOpenVideoPlayer = (video: any) => {
    setAppState({
      ...appState,
      currentScreen: 'player',
      selectedVideo: video
    });
  };

  // Voltar para home
  const handleBackToHome = () => {
    setAppState({
      ...appState,
      currentScreen: 'home'
    });
  };

  // Voltar para arenas
  const handleBackToArenas = () => {
    setAppState({
      ...appState,
      currentScreen: 'arenas'
    });
  };

  // Voltar para calendário
  const handleBackToCalendar = () => {
    setAppState({
      ...appState,
      currentScreen: 'calendar'
    });
  };

  // Voltar para quadras
  const handleBackToQuadras = () => {
    setAppState({
      ...appState,
      currentScreen: 'quadras'
    });
  };

  // Voltar para horários
  const handleBackToHours = () => {
    setAppState({
      ...appState,
      currentScreen: 'hours'
    });
  };

  // Voltar para vídeos (do player)
  const handleBackToVideos = () => {
    setAppState({
      ...appState,
      currentScreen: 'videos'
    });
  };

  const renderCurrentScreen = () => {
    switch (appState.currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToVideos={handleNavigateToVideos}
            onNavigateToLogin={handleNavigateToLogin}
            isLoggedIn={appState.user.isLoggedIn}
            userName={appState.user.name}
          />
        );
      
      case 'login':
        return (
          <LoginScreen
            onLogin={handleLogin}
            onBack={handleBackToHome}
          />
        );
      
      case 'arenas':
        return (
          <ArenaListScreen 
            onSelectArena={handleSelectArena} 
          />
        );
      
      case 'calendar':
        return (
          <CalendarScreen
            arenaName={appState.selectedArena?.name || ''}
            onSelectDate={handleSelectDate}
            onBack={handleBackToArenas}
          />
        );
      
      case 'quadras':
        return (
          <QuadraSelectionScreen
            arenaName={appState.selectedArena?.name || ''}
            selectedDate={appState.selectedDate || ''}
            onSelectQuadra={handleSelectQuadra}
            onBack={handleBackToCalendar}
          />
        );
      
      case 'hours':
        return (
          <HourSelectionScreen
            arenaName={appState.selectedArena?.name || ''}
            selectedDate={appState.selectedDate || ''}
            quadraName={appState.selectedQuadra?.name || ''}
            onSelectHour={handleSelectHour}
            onBack={handleBackToQuadras}
          />
        );
      
      case 'videos':
        return (
          <FilteredVideosScreen
            arenaName={appState.selectedArena?.name || ''}
            selectedDate={appState.selectedDate || ''}
            quadraName={appState.selectedQuadra?.name || ''}
            selectedHour={appState.selectedHour || 0}
            onBack={handleBackToHours}
            onVideoClick={handleOpenVideoPlayer}
          />
        );
      
      case 'player':
        return (
          <VideoPlayerScreen
            video={appState.selectedVideo!}
            onBack={handleBackToVideos}
          />
        );
      
      default:
        return (
          <HomeScreen
            onNavigateToVideos={handleNavigateToVideos}
            onNavigateToLogin={handleNavigateToLogin}
            isLoggedIn={appState.user.isLoggedIn}
            userName={appState.user.name}
          />
        );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {renderCurrentScreen()}
    </SafeAreaView>
  );
};

export default SportFTVApp;
