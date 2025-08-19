import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Camera, ArrowLeft, MapPin } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { db } from '../services/firebase';

// Tipagens
type QuadraSelectionNavigationProp = StackNavigationProp<RootStackParamList, 'QuadraSelection'>;
type QuadraSelectionRouteProp = RouteProp<RootStackParamList, 'QuadraSelection'>;

interface Quadra {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  totalVideos: number;
}

// O componente começa aqui
const QuadraSelectionScreen: React.FC = () => {
  const navigation = useNavigation<QuadraSelectionNavigationProp>();
  const route = useRoute<QuadraSelectionRouteProp>();
  const { arenaId, arenaName, selectedDate } = route.params;

  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuadras();
  }, [arenaId, selectedDate]);

  // Lógica de busca com a estrutura de coleções separadas
    // Em src/screens/QuadrasSelectionScreen.tsx

  const fetchQuadras = async () => {
    setLoading(true);
    try {
      console.log(`Buscando quadras da arena ${arenaId}...`);

      // Passo 1: Busca TODAS as quadras que pertencem a esta arena.
      const quadrasSnapshot = await db.collection('quadras')
        .where('arenaId', '==', arenaId)
        .get();

      if (quadrasSnapshot.empty) {
        console.log('Nenhuma quadra cadastrada para esta arena.');
        setQuadras([]);
        setLoading(false);
        return;
      }

      // Converte os documentos do Firestore para um tipo conhecido, garantindo a tipagem.
      const todasQuadras: Quadra[] = quadrasSnapshot.docs.map((doc): Quadra => {
        const data = doc.data();
        return {
          id: doc.id,
          name: String(data.name || `Quadra ${doc.id}`), // Força a conversão para String
          status: 'inactive',
          totalVideos: 0,
          description: 'Nenhum vídeo nesta data',
        };
      });

      // Passo 2: Busca os vídeos da DATA SELECIONADA.
      const videosSnapshot = await db.collection('videos')
        .where('arenaId', '==', arenaId)
        .where('date', '==', selectedDate)
        .get();

      const videoCounts = new Map<string, number>();
      videosSnapshot.forEach(doc => {
        const quadraId = doc.data().quadraId;
        if (quadraId) {
          videoCounts.set(quadraId, (videoCounts.get(quadraId) || 0) + 1);
        }
      });

      // Passo 3: Mapeia os resultados finais. Agora o TypeScript tem certeza do tipo de 'quadra'.
      const quadrasFinais = todasQuadras.map((quadra): Quadra => {
        const count = videoCounts.get(quadra.id) || 0;
        return {
          ...quadra,
          totalVideos: count,
          status: count > 0 ? 'active' : 'inactive',
          description: count > 0 
            ? `${count} vídeo${count > 1 ? 's' : ''} disponível${count > 1 ? 's' : ''}`
            : 'Nenhum vídeo nesta data',
        };
      });
      
      quadrasFinais.sort((a, b) => a.name.localeCompare(b.name));
      setQuadras(quadrasFinais);

    } catch (error) {
      console.error('Erro ao buscar quadras:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao buscar as quadras.');
      setQuadras([]); // Garante que o estado seja limpo em caso de erro
    } finally {
      setLoading(false);
    }
  };

  // Função para navegar para a próxima tela
  const handleSelectQuadra = (quadra: Quadra) => {
    navigation.navigate('HourSelection', {
      arenaId,
      arenaName,
      selectedDate,
      quadraId: quadra.id,
      quadraName: quadra.name,
    });
  };

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    // Adiciona T00:00:00 para evitar problemas de fuso horário na conversão
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Função que renderiza cada item da lista
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
          <Text style={[styles.quadraName, item.status === 'inactive' && styles.textInactive]}>
            {item.name}
          </Text>
          <Text style={[styles.quadraDescription, item.status === 'inactive' && styles.textInactive]}>
            {item.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Parte visual do componente (JSX)
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
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1e3a8a" />
            <Text style={styles.loadingText}>Carregando quadras disponíveis...</Text>
          </View>
        ) : (
          quadras.length === 0 ? (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>Nenhuma Quadra com Vídeos</Text>
                <Text style={styles.emptyText}>Não foram encontrados vídeos para esta data. Por favor, selecione outro dia.</Text>
            </View>
          ) : (
            <FlatList
              data={quadras}
              renderItem={renderQuadraCard}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )
        )}
      </View>
    </View>
  );
}; // O componente termina aqui

// Os estilos ficam fora do componente
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
        opacity: 0.7,
    },
    quadraHeader: {
        flexDirection: 'row',
        alignItems: 'center',
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
});

export default QuadraSelectionScreen;