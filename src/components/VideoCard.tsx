import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Video from 'react-native-video'; // PASSO 1: Importar o componente de vídeo
import { Play } from 'lucide-react-native';

// PASSO 2: Atualizar a interface com as novas props
interface VideoCardProps {
  video: { // Recebemos o objeto de vídeo completo
    id: string;
    title: string;
    thumbnailUrl?: string;
    videoUrl: string;
    duration: string;
  };
  isPlaying: boolean; // Diz se ESTE card é o que deve tocar
  onPlay: (videoId: string) => void; // Função para avisar a tela principal
}

const VideoCard: React.FC<VideoCardProps> = ({ 
  video,
  isPlaying,
  onPlay 
}) => {

  return (
    <View style={styles.card}>
      {/* O TouchableOpacity agora envolve apenas a área de play */}
      <View style={styles.thumbnailContainer}>
        {isPlaying ? (
          // MODO PLAYER: Se isPlaying for true, renderiza o Player de Vídeo
          <Video
            source={{ uri: video.videoUrl }}
            style={styles.videoPlayer}
            resizeMode="cover"
            controls={true} // Mostra os controles nativos (play, pause, volume, etc.)
            paused={false}  // Inicia tocando automaticamente
            // onEnd={() => onPlay(video.id)} // Opcional: para o vídeo ao terminar
          />
        ) : (
          // MODO THUMBNAIL: Se não, renderiza a imagem com o botão de play
          <TouchableOpacity style={styles.touchableThumb} onPress={() => onPlay(video.id)}>
            <Image source={{ uri: video.thumbnailUrl || 'https://via.placeholder.com/300x200/1e3a8a/ffffff?text=Video' }} style={styles.thumbnail} />
            <View style={styles.playOverlay}>
              <Play size={24} color="white" fill="white" />
            </View>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{video.duration}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{video.title}</Text>
      </View>
    </View>
  );
};

// PASSO 3: Adicionar e ajustar os estilos
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  touchableThumb: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    ...StyleSheet.absoluteFillObject, // Faz o vídeo ocupar todo o espaço
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 40,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});

export default VideoCard;