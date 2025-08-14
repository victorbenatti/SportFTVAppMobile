import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { MapPin, Users, ArrowLeft, Video } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useUser } from '../context/UserContext';
import { db } from '../services/firebase';
import { collection, getDocs, query, where } from '@react-native-firebase/firestore';

type ArenaListNavigationProp = StackNavigationProp<RootStackParamList, 'ArenaList'>;

interface Arena {
  id: string;
  name: string;
  address: string;
  imageUrl?: string;
  totalQuadras: number;
  totalVideos: number;
  status?: string;
}

interface ArenaListScreenProps {}

const ArenaListScreen: React.FC<ArenaListScreenProps> = () => {
  const navigation = useNavigation<ArenaListNavigationProp>();
  const { user, logout } = useUser();
  const [arenas, setArenas] = useState<Arena[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar arenas reais do Firebase
  const fetchArenas = async () => {
    try {
      setLoading(true);
      console.log('Buscando arenas do Firebase...');
      
      // Buscar vídeos para contar por arena
      const videosCollection = collection(db, 'videos');
      const videosSnapshot = await getDocs(videosCollection);
      
      // Contar vídeos por arena
      const arenaVideoCounts: { [key: string]: number } = {};
      const arenaNames: { [key: string]: string } = {};
      
      videosSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.arenaId) {
          arenaVideoCounts[data.arenaId] = (arenaVideoCounts[data.arenaId] || 0) + 1;
          // Tentar extrair nome da arena dos dados do vídeo se disponível
          if (data.arenaName) {
            arenaNames[data.arenaId] = data.arenaName;
          }
        }
      });
      
      // Criar lista de arenas baseada nos vídeos encontrados
      const arenasData: Arena[] = [];
      
      Object.keys(arenaVideoCounts).forEach((arenaId) => {
        arenasData.push({
          id: arenaId,
          name: arenaNames[arenaId] || `Arena ${arenaId.replace('arena_', '').replace('_', ' ')}`,
          address: 'Endereço não informado',
          imageUrl: 'https://via.placeholder.com/300x200/1e3a8a/ffffff?text=Arena',
          totalQuadras: 0, // Será calculado depois
          totalVideos: arenaVideoCounts[arenaId],
          status: 'active'
        });
      });
      
      // Se não houver arenas nos vídeos, criar uma arena padrão
      if (arenasData.length === 0) {
        arenasData.push({
          id: 'arena_sport_center',
          name: 'Arena Sport Center',
          address: 'Adicione vídeos para esta arena',
          imageUrl: 'https://via.placeholder.com/300x200/1e3a8a/ffffff?text=Arena+Sport+Center',
          totalQuadras: 0,
          totalVideos: 0,
          status: 'active'
        });
      }
      
      console.log(`Encontradas ${arenasData.length} arenas:`, arenasData);
      setArenas(arenasData);
      
    } catch (error) {
      console.error('Erro ao buscar arenas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as arenas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArenas();
  }, []);

  const handleSelectArena = (arena: Arena) => {
    if (arena.totalVideos === 0) {
      Alert.alert(
        'Sem vídeos',
        'Esta arena ainda não possui vídeos disponíveis.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    navigation.navigate('Calendar', { arenaId: arena.id, arenaName: arena.name });
  };
  
  const renderArenaCard = ({ item }: { item: Arena }) => (
    <TouchableOpacity 
      style={[
        styles.arenaCard,
        item.totalVideos === 0 && styles.arenaCardDisabled
      ]} 
      onPress={() => handleSelectArena(item)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.arenaImage} 
        resizeMode="cover"
      />
      <View style={styles.arenaContent}>
        <Text style={styles.arenaName}>{item.name}</Text>
        <View style={styles.addressContainer}>
          <MapPin size={14} color="#6B7280" />
          <Text style={styles.arenaAddress}>{item.address}</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Video size={14} color={item.totalVideos > 0 ? "#1e3a8a" : "#999"} />
            <Text style={[
              styles.statText,
              item.totalVideos === 0 && styles.statTextDisabled
            ]}>
              {item.totalVideos} vídeos
            </Text>
          </View>
          {item.totalQuadras > 0 && (
            <View style={styles.statItem}>
              <Users size={14} color="#1e3a8a" />
              <Text style={styles.statText}>{item.totalQuadras} quadra{item.totalQuadras > 1 ? 's' : ''}</Text>
            </View>
          )}
        </View>
        {item.totalVideos === 0 && (
          <Text style={styles.noVideosText}>Nenhum vídeo disponível</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    logout();
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Olá, {user.name}!</Text>
          <Text style={styles.subtitle}>Escolha uma Arena</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e3a8a" />
          <Text style={styles.loadingText}>Carregando arenas...</Text>
        </View>
      ) : (
        <FlatList
          data={arenas}
          renderItem={renderArenaCard}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1e3a8a',
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#E5E7EB',
  },
  logoutButton: {
    padding: 4,
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  arenaCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  arenaImage: {
    width: '100%',
    height: 120,
  },
  arenaContent: {
    padding: 16,
  },
  arenaName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  arenaAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
  },
  quadrasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quadrasText: {
    fontSize: 14,
    color: '#1e3a8a',
    marginLeft: 6,
    fontWeight: '500',
  },
  arenaCardDisabled: {
    opacity: 0.6,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#1e3a8a',
    marginLeft: 6,
    fontWeight: '500',
  },
  statTextDisabled: {
    color: '#999',
  },
  noVideosText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
});

export default ArenaListScreen;
