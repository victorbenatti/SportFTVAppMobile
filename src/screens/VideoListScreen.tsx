import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { ArrowLeft, Calendar, Clock, MapPin, Video } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { VideoMoment } from '../types/sportftv';
import { db } from '../services/firebase';
import VideoCard from '../components/VideoCard';

// Tipagens
type VideoListNavigationProp = StackNavigationProp<RootStackParamList, 'VideoList'>;
type VideoListRouteProp = RouteProp<RootStackParamList, 'VideoList'>;

const VideoListScreen: React.FC = () => {
  const navigation = useNavigation<VideoListNavigationProp>();
  const route = useRoute<VideoListRouteProp>();
  const { arenaId, arenaName, selectedDate, quadraId, quadraName, selectedHour } = route.params;
  
  const [videos, setVideos] = useState<VideoMoment[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, [route.params]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      console.log('Buscando vídeos com os filtros:', { arenaId, quadraId, selectedDate, selectedHour });
      
      const videosQuery = db.collection('videos')
        .where('arenaId', '==', arenaId)
        .where('quadraId', '==', quadraId)
        .where('date', '==', selectedDate)
        .where('hour', '==', selectedHour)
        .orderBy('timestamp', 'desc');

      const snapshot = await videosQuery.get();
      
      const fetchedVideos: VideoMoment[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || 'Vídeo sem título',
            thumbnailUrl: data.thumbnailUrl || 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Video',
            videoUrl: data.videoUrl || '',
            duration: data.duration || '0:00',
            timestamp: data.timestamp || new Date().toISOString(),
            date: data.date || '',
            description: data.description || '',
            tournament: data.tournament || '',
            arenaId: data.arenaId,
            quadraId: data.quadraId,
            hour: data.hour,
          };
      });

      setVideos(fetchedVideos);

    } catch (error) {
      console.error('Erro ao buscar vídeos:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao buscar os vídeos.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayVideo = (videoId: string) => {
    setPlayingVideoId(prevId => (prevId === videoId ? null : videoId));
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderVideoItem = ({ item }: { item: VideoMoment }) => (
    <VideoCard
      video={item}
      isPlaying={playingVideoId === item.id}
      onPlay={handlePlayVideo}
    />
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <ArrowLeft size={24} color="white" />
         </TouchableOpacity>
         <View style={styles.headerContent}>
           <Text style={styles.title}>Vídeos Encontrados</Text>
           <Text style={styles.subtitle}>{quadraName} - {arenaName}</Text>
        </View>
       </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
           <View style={styles.infoRow}>
            <Calendar size={16} color="#1e3a8a" />
            <Text style={styles.infoText}>{formatDate(selectedDate)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Clock size={16} color="#1e3a8a" />
            <Text style={styles.infoText}>Horário: {selectedHour}:00 - {selectedHour}:59</Text>
           </View>
           <View style={styles.infoRow}>
             <MapPin size={16} color="#1e3a8a" />
            <Text style={styles.infoText}>{quadraName}</Text>
          </View>
        </View>

         {loading ? (
           <View style={styles.loadingContainer}>
             <ActivityIndicator size="large" color="#1e3a8a" />
             <Text style={styles.loadingText}>Buscando vídeos...</Text>
           </View>
         ) : (
           videos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Video size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>Nenhum vídeo encontrado</Text>
              <Text style={styles.emptySubtitle}>Não há vídeos para esta seleção.</Text>
             </View>
           ) : (
             <FlatList
              data={videos}
              renderItem={renderVideoItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
             />
           )
         )}
       </View>
     </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        padding: 20,
        backgroundColor: '#1e3a8a',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#E5E7EB',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6B7280',
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#111827',
        marginLeft: 8,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 20,
    }
});

export default VideoListScreen;