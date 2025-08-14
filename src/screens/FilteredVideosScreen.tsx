import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Linking } from 'react-native';
import { ChevronLeft, Download, Play, Clock, Calendar } from 'lucide-react-native';
import { getVideosWithFilters } from '../utils/firestore-helpers';

// Interface simplificada com apenas os 4 campos essenciais
interface VideoMoment {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  // Campos essenciais para filtros
  arenaId: string;
  quadraId: string;
  date: string;
  hour: number;
  // Campos opcionais
  tournament?: string;
  views?: string;
  timestamp?: string;
}

interface FilteredVideosScreenProps {
  arenaName: string;
  selectedDate: string;
  quadraName: string;
  selectedHour: number;
  arenaId?: string;
  quadraId?: string;
  onBack: () => void;
  onVideoClick: (video: VideoMoment) => void;
}

const FilteredVideosScreen: React.FC<FilteredVideosScreenProps> = ({
  arenaName,
  selectedDate,
  quadraName,
  selectedHour,
  arenaId,
  quadraId,
  onBack,
  onVideoClick
}) => {
  const [videos, setVideos] = useState<VideoMoment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFilteredVideos();
  }, [selectedDate, selectedHour, arenaId, quadraId]);

  const fetchFilteredVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Buscando vídeos com filtros:', {
        arenaId,
        quadraId,
        selectedDate,
        selectedHour
      });

      // Validar se todos os campos essenciais estão presentes
      if (!arenaId || !quadraId || !selectedDate || selectedHour === undefined) {
        throw new Error('Campos obrigatórios ausentes para filtrar vídeos');
      }

      // Usar a função helper para buscar vídeos com filtros
      const videosData = await getVideosWithFilters({
        arenaId,
        quadraId,
        date: selectedDate,
        hour: selectedHour
      });

      // Mapear os dados para o formato esperado pela interface
      const formattedVideos: VideoMoment[] = videosData.map((video) => ({
        id: video.id,
        title: video.title || 'Vídeo sem título',
        description: video.description || '',
        thumbnailUrl: video.thumbnailUrl || 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Video',
        videoUrl: video.videoUrl || '',
        duration: video.duration || '0:00',
        // Campos essenciais (obrigatórios)
        arenaId: video.arenaId,
        quadraId: video.quadraId,
        date: video.date,
        hour: video.hour,
        // Campos opcionais
        tournament: video.tournament || 'Torneio não informado',
        views: typeof video.views === 'number' ? video.views.toString() : video.views || '0',
        timestamp: video.timestamp || new Date().toISOString()
      }));

      console.log(`Encontrados ${formattedVideos.length} vídeos`);
      setVideos(formattedVideos);
      
    } catch (error) {
      console.error("Erro ao buscar vídeos:", error);
      setError(`Erro ao carregar vídeos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video: VideoMoment) => {
    // Usar o player interno em vez de abrir no navegador
    onVideoClick(video);
  };

  const handleDownloadVideo = (video: VideoMoment) => {
    Alert.alert(
      "Download do Vídeo",
      `Deseja baixar "${video.title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Baixar", 
          onPress: () => {
            if (video.videoUrl) {
              Linking.openURL(video.videoUrl);
            } else {
              Alert.alert("Erro", "URL do vídeo não disponível");
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    try {
      // Tenta diferentes formatos de data
      let date;
      if (dateString.includes('/')) {
        // Formato DD/MM/YYYY
        const [day, month, year] = dateString.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        date = new Date(dateString);
      }
      
      return date.toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Carregando...</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e3a8a" />
          <Text style={styles.loadingText}>Buscando vídeos...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Erro</Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchFilteredVideos}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Melhores Momentos</Text>
          <Text style={styles.subtitle}>
            {arenaName} • {quadraName} • {selectedHour}:00-{selectedHour}:59
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.filterInfo}>
          <View style={styles.filterRow}>
            <Calendar size={16} color="#1e3a8a" />
            <Text style={styles.filterText}>{formatDate(selectedDate)}</Text>
          </View>
          <View style={styles.filterRow}>
            <Clock size={16} color="#1e3a8a" />
            <Text style={styles.filterText}>
              Das {selectedHour}:00 às {selectedHour}:59
            </Text>
          </View>
        </View>

        {videos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Nenhum vídeo encontrado</Text>
            <Text style={styles.emptyText}>
              Não há vídeos disponíveis para os filtros selecionados.
            </Text>
            <TouchableOpacity style={styles.backToFiltersButton} onPress={onBack}>
              <Text style={styles.backToFiltersText}>Alterar Filtros</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={videos}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.videoItem}
                onPress={() => handleVideoClick(item)}
              >
                <View style={styles.videoContent}>
                  <Text style={styles.videoTitle}>{item.title}</Text>
                  <Text style={styles.videoDescription}>{item.description}</Text>
                  <View style={styles.videoMeta}>
                    <Text style={styles.videoTournament}>{item.tournament}</Text>
                    <Text style={styles.videoDuration}>{item.duration}</Text>
                  </View>
                  <Text style={styles.videoDate}>{formatDate(item.date)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => handleDownloadVideo(item)}
                >
                  <Download size={20} color="#1e3a8a" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
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
    fontSize: 12,
    color: '#E5E7EB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filterInfo: {
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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterText: {
    fontSize: 14,
    color: '#111827',
    marginLeft: 8,
    fontWeight: '500',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  backToFiltersButton: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backToFiltersText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  videoItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoContent: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  videoTournament: {
    fontSize: 12,
    color: '#1e3a8a',
    fontWeight: '500',
  },
  videoDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  videoDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  downloadButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
});

export default FilteredVideosScreen;
