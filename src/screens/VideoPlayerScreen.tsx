import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { ChevronLeft, Play, Pause } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

// Tipagens para navegação
type VideoPlayerRouteProp = RouteProp<RootStackParamList, 'VideoPlayer'>;
type VideoPlayerNavigationProp = StackNavigationProp<RootStackParamList, 'VideoPlayer'>;

const VideoPlayerScreen: React.FC = () => {
  // Hooks para acessar os dados e a navegação
  const navigation = useNavigation<VideoPlayerNavigationProp>();
  const route = useRoute<VideoPlayerRouteProp>();
  const { video } = route.params; // Pega os dados do vídeo a partir dos parâmetros da rota

  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const videoRef = useRef<VideoRef>(null);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      {video.videoUrl ? (
        <Video
          ref={videoRef}
          source={{ uri: video.videoUrl }}
          style={styles.videoPlayer}
          resizeMode="contain"
          paused={paused}
          onLoad={() => setLoading(false)} // Esconde o loading quando o vídeo carrega
          onError={(error) => console.error('Erro no player de vídeo:', error)}
          onEnd={() => setPaused(true)} // Pausa o vídeo quando ele termina
        />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>URL do vídeo não encontrada.</Text>
        </View>
      )}

      {/* Overlay de Loading */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Controles do Player */}
      <View style={styles.controlsOverlay}>
        {/* Botão de Voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={32} color="#fff" />
        </TouchableOpacity>

        {/* Botão de Play/Pause */}
        <TouchableOpacity style={styles.playButton} onPress={() => setPaused(!paused)}>
          {paused ? <Play size={32} color="#fff" /> : <Pause size={32} color="#fff" />}
        </TouchableOpacity>
      </View>

      {/* Informações do Vídeo */}
      <View style={styles.infoOverlay}>
        <Text style={styles.titleText}>{video.title}</Text>
        <Text style={styles.descriptionText}>{video.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  videoPlayer: {
    width: width,
    height: height,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
  },
  playButton: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    padding: 16,
  },
  titleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    color: '#eee',
    fontSize: 14,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  }
});

export default VideoPlayerScreen;