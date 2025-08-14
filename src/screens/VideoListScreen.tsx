import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert, ActivityIndicator } from 'react-native';
import { ArrowLeft, Play, Calendar, Clock, MapPin, Video, Eye } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { VideoMoment } from '../types/sportftv';
import { db } from '../services/firebase';
import { collection, getDocs, query, where, orderBy } from '@react-native-firebase/firestore';

type VideoListNavigationProp = StackNavigationProp<RootStackParamList, 'VideoList'>;
type VideoListRouteProp = RouteProp<RootStackParamList, 'VideoList'>;

interface VideoListScreenProps {}

const VideoListScreen: React.FC<VideoListScreenProps> = () => {
  const navigation = useNavigation<VideoListNavigationProp>();
  const route = useRoute<VideoListRouteProp>();
  const { arenaId, arenaName, selectedDate, quadraId, quadraName, selectedHour, videoCount } = route.params;
  
  const [videos, setVideos] = useState<VideoMoment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent' | 'popular'>('all');

  useEffect(() => {
    fetchVideos();
  }, [route.params]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const videosCollection = collection(db, 'videos');
      
      // Filtrar por arenaId e quadraId
      let q = query(
        videosCollection,
        where('arenaId', '==', arenaId),
        where('quadraId', '==', quadraId)
      );

      // Se houver data selecionada, filtrar também por data
      if (selectedDate) {
        q = query(q, where('date', '==', selectedDate));
      }

      // Ordenar por timestamp (mais recentes primeiro)
      q = query(q, orderBy('createdAt', 'desc'));

      const snapshot = await getDocs(q);
      const fetchedVideos: VideoMoment[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedVideos.push({
          id: doc.id,
          title: data.title || 'Vídeo sem título',
          thumbnailUrl: data.thumbnailUrl || 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Video',
          videoUrl: data.videoUrl || '',
          duration: data.duration || '0:00',
          timestamp: data.timestamp || data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
          date: data.date || new Date().toISOString().split('T')[0],
          description: data.description || '',
          tournament: data.tournament || '',
          views: typeof data.views === 'number' ? data.views : parseInt(data.views) || 0
        });
      });

      setVideos(fetchedVideos);
    } catch (error) {
      console.error('Erro ao buscar vídeos:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleVideoPress = (video: VideoMoment) => {
    Alert.alert(
      'Reproduzir Vídeo',
      `Deseja reproduzir "${video.title}"?\n\nDuração: ${video.duration}\nVisualizações: ${video.views}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reproduzir', onPress: () => {
          // Aqui seria implementada a navegação para o player de vídeo
          Alert.alert('Player', 'Funcionalidade do player será implementada em breve!');
        }}
      ]
    );
  };

  const renderVideoItem = ({ item }: { item: VideoMoment }) => (
    <TouchableOpacity 
      style={styles.videoCard}
      onPress={() => handleVideoPress(item)}
    >
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: item.thumbnailUrl }} 
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.playOverlay}>
          <Play size={24} color="white" fill="white" />
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      </View>
      
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{item.title}</Text>
        <View style={styles.videoMeta}>
          <View style={styles.metaRow}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.metaText}>{item.timestamp}</Text>
          </View>
          <View style={styles.metaRow}>
            <Eye size={14} color="#6B7280" />
            <Text style={styles.metaText}>{item.views} views</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Carregando Vídeos...</Text>
            <Text style={styles.subtitle}>{quadraName} - {arenaName}</Text>
          </View>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.loadingText}>Buscando vídeos das {selectedHour}:00...</Text>
        </View>
      </View>
    );
  }

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

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {videos.length} vídeo{videos.length !== 1 ? 's' : ''} encontrado{videos.length !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.resultsSubtitle}>
            Toque em um vídeo para reproduzir
          </Text>
        </View>

        {videos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Video size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Nenhum vídeo encontrado</Text>
            <Text style={styles.emptySubtitle}>
              Não há vídeos disponíveis para esta quadra na data e horário selecionados.
            </Text>
          </View>
        ) : (
          <FlatList
            data={videos}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
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
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
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
  resultsHeader: {
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  resultsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  listContainer: {
    paddingBottom: 20,
  },
  videoCard: {
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
    position: 'relative',
    height: 120,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
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
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
});

export default VideoListScreen;