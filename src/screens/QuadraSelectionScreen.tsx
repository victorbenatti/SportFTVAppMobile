import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Camera, ChevronLeft, MapPin, ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { db } from '../services/firebase';
import { collection, getDocs, query, where } from '@react-native-firebase/firestore';

type QuadraSelectionNavigationProp = StackNavigationProp<RootStackParamList, 'QuadraSelection'>;
type QuadraSelectionRouteProp = RouteProp<RootStackParamList, 'QuadraSelection'>;

interface Quadra {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  totalVideos: number;
}

interface QuadraSelectionScreenProps {}

const QuadraSelectionScreen: React.FC<QuadraSelectionScreenProps> = () => {
  const navigation = useNavigation<QuadraSelectionNavigationProp>();
  const route = useRoute<QuadraSelectionRouteProp>();
  const { arenaId, arenaName, selectedDate } = route.params;

  const handleSelectQuadra = (quadra: Quadra) => {
    navigation.navigate('HourSelection', {
      arenaId,
      arenaName,
      selectedDate,
      quadraId: quadra.id,
      quadraName: quadra.name
    });
  };
  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuadras();
  }, []);

  const fetchQuadras = async () => {
    try {
      setLoading(true);
      console.log(`Buscando quadras para arena ${arenaId} na data ${selectedDate}...`);
      
      // Buscar vídeos para esta arena e data específica
      const videosCollection = collection(db, 'videos');
      const q = query(
        videosCollection,
        where('arenaId', '==', arenaId),
        where('date', '==', selectedDate)
      );
      
      const snapshot = await getDocs(q);
      
      // Contar vídeos por quadra
      const quadraVideoCounts: { [key: string]: number } = {};
      const quadraNames: { [key: string]: string } = {};
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.quadraId) {
          quadraVideoCounts[data.quadraId] = (quadraVideoCounts[data.quadraId] || 0) + 1;
          // Tentar extrair nome da quadra dos dados do vídeo se disponível
          if (data.quadraName) {
            quadraNames[data.quadraId] = data.quadraName;
          }
        }
      });
      
      // Criar lista de quadras baseada nos vídeos encontrados
      const quadrasData: Quadra[] = [];
      
      Object.keys(quadraVideoCounts).forEach((quadraId) => {
        quadrasData.push({
          id: quadraId,
          name: quadraNames[quadraId] || `Quadra ${quadraId.replace('quadra_', '').replace('quadra', '')}`,
          description: `${quadraVideoCounts[quadraId]} vídeos disponíveis`,
          status: 'active',
          totalVideos: quadraVideoCounts[quadraId]
        });
      });
      
      // Se não houver quadras com vídeos, criar quadras padrão
      if (quadrasData.length === 0) {
        const defaultQuadras = ['quadra_1', 'quadra_2', 'quadra_3', 'quadra_4'];
        
        for (const quadraId of defaultQuadras) {
          quadrasData.push({
            id: quadraId,
            name: `Quadra ${quadraId.replace('quadra_', '')}`,
            description: 'Nenhum vídeo disponível para esta data',
            status: 'inactive',
            totalVideos: 0
          });
        }
      }
      
      // Ordenar quadras por nome
      quadrasData.sort((a, b) => a.name.localeCompare(b.name));
      
      console.log(`Encontradas ${quadrasData.length} quadras:`, quadrasData);
      setQuadras(quadrasData);
      
    } catch (error) {
      console.error('Erro ao buscar quadras:', error);
      // Fallback para dados padrão em caso de erro
      setQuadras([
        { id: 'quadra_1', name: 'Quadra 1', description: 'Erro ao carregar dados', status: 'inactive', totalVideos: 0 },
        { id: 'quadra_2', name: 'Quadra 2', description: 'Erro ao carregar dados', status: 'inactive', totalVideos: 0 },
        { id: 'quadra_3', name: 'Quadra 3', description: 'Erro ao carregar dados', status: 'inactive', totalVideos: 0 },
        { id: 'quadra_4', name: 'Quadra 4', description: 'Erro ao carregar dados', status: 'inactive', totalVideos: 0 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getVideoCountForQuadra = async (quadraId: string): Promise<number> => {
    try {
      const videosCollection = collection(db, 'videos');
      const q = query(
        videosCollection,
        where('arenaId', '==', arenaId),
        where('quadraId', '==', quadraId),
        where('date', '==', selectedDate)
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error(`Erro ao contar vídeos para quadra ${quadraId}:`, error);
      return 0;
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

  const renderQuadraCard = ({ item }: { item: Quadra }) => (
    <TouchableOpacity
      style={[
        styles.quadraCard,
        item.status === 'inactive' && styles.quadraCardInactive
      ]}
      onPress={() => item.status === 'active' && handleSelectQuadra(item)}
      disabled={item.status === 'inactive'}
    >
      <View style={styles.quadraHeader}>
        <View style={[
          styles.cameraIcon,
          item.status === 'inactive' && styles.cameraIconInactive
        ]}>
          <Camera size={24} color={item.status === 'active' ? 'white' : '#9CA3AF'} />
        </View>
        <View style={styles.quadraInfo}>
          <Text style={[
            styles.quadraName,
            item.status === 'inactive' && styles.textInactive
          ]}>
            {item.name}
          </Text>
          <Text style={[
            styles.quadraDescription,
            item.status === 'inactive' && styles.textInactive
          ]}>
            {item.description}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusDot,
            item.status === 'active' ? styles.statusActive : styles.statusInactive
          ]} />
          <Text style={[
            styles.statusText,
            item.status === 'inactive' && styles.textInactive
          ]}>
            {item.status === 'active' ? 'Ativa' : 'Inativa'}
          </Text>
        </View>
      </View>
      
      <View style={styles.quadraFooter}>
        <View style={styles.videosCount}>
          <Text style={[
            styles.videosNumber,
            item.status === 'inactive' && styles.textInactive
          ]}>
            {item.totalVideos}
          </Text>
          <Text style={[
            styles.videosLabel,
            item.status === 'inactive' && styles.textInactive
          ]}>
            vídeos disponíveis
          </Text>
        </View>
        {item.status === 'active' && (
          <Text style={styles.tapHint}>Toque para selecionar</Text>
        )}
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
            <Text style={styles.title}>{arenaName}</Text>
            <Text style={styles.subtitle}>Selecione uma Quadra</Text>
          </View>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e3a8a" />
          <Text style={styles.loadingText}>Carregando quadras...</Text>
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
          <Text style={styles.title}>{arenaName}</Text>
          <Text style={styles.subtitle}>Selecione uma Quadra</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.dateInfo}>
          <MapPin size={16} color="#1e3a8a" />
          <Text style={styles.dateText}>
            {formatDate(selectedDate)}
          </Text>
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Escolha a Câmera</Text>
          <Text style={styles.instructionsText}>
            Cada quadra possui uma câmera dedicada para capturar os melhores momentos
          </Text>
        </View>

        <FlatList
          data={quadras}
          renderItem={renderQuadraCard}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
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
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14,
    color: '#1e3a8a',
    marginLeft: 8,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  instructionsContainer: {
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  quadraCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quadraCardInactive: {
    backgroundColor: '#F3F4F6',
  },
  quadraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cameraIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#1e3a8a',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cameraIconInactive: {
    backgroundColor: '#E5E7EB',
  },
  quadraInfo: {
    flex: 1,
  },
  quadraName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  quadraDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusActive: {
    backgroundColor: '#10B981',
  },
  statusInactive: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  quadraFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videosCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videosNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginRight: 6,
  },
  videosLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  tapHint: {
    fontSize: 12,
    color: '#1e3a8a',
    fontStyle: 'italic',
  },
  textInactive: {
    color: '#9CA3AF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default QuadraSelectionScreen;
