import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Clock, ArrowLeft, Calendar, Video } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { db } from '../services/firebase';


type HourSelectionNavigationProp = StackNavigationProp<RootStackParamList, 'HourSelection'>;
type HourSelectionRouteProp = RouteProp<RootStackParamList, 'HourSelection'>;

interface HourSlot {
  hour: number;
  displayHour: string;
  videoCount: number;
  hasVideos: boolean;
}

interface HourSelectionScreenProps {}

const HourSelectionScreen: React.FC<HourSelectionScreenProps> = () => {
  const navigation = useNavigation<HourSelectionNavigationProp>();
  const route = useRoute<HourSelectionRouteProp>();
  const { arenaId, arenaName, selectedDate, quadraId, quadraName } = route.params;
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [hourSlots, setHourSlots] = useState<HourSlot[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar horários reais do Firebase
  // Em src/screens/HourSelectionScreen.tsx

// CÓDIGO CORRIGIDO PARA A FUNÇÃO fetchHourSlots
  const fetchHourSlots = async () => {
    try {
      setLoading(true);
      console.log(`Buscando horários para arena ${arenaId}, quadra ${quadraId} na data ${selectedDate}...`);
      
      // Constrói a query usando a sintaxe do @react-native-firebase
      const videosQuery = db.collection('videos')
        .where('arenaId', '==', arenaId)
        .where('quadraId', '==', quadraId)
        .where('date', '==', selectedDate);
        
      const snapshot = await videosQuery.get();
      
      // O resto da lógica para contar os vídeos permanece a mesma
      const hourVideoCounts: { [key: number]: number } = {};
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.hour !== undefined && data.hour !== null) {
          const hour = parseInt(data.hour.toString(), 10);
          if (!isNaN(hour) && hour >= 0 && hour <= 23) {
            hourVideoCounts[hour] = (hourVideoCounts[hour] || 0) + 1;
          }
        }
      });
      
      const slots: HourSlot[] = [];
      for (let hour = 6; hour <= 23; hour++) {
        const videoCount = hourVideoCounts[hour] || 0;
        slots.push({
          hour,
          displayHour: `${hour.toString().padStart(2, '0')}:00`,
          videoCount,
          hasVideos: videoCount > 0
        });
      }
      
      console.log(`Encontrados horários:`, slots.filter(s => s.hasVideos).map(s => s.hour));
      setHourSlots(slots);
      
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      // Adicionamos um Alert para melhor feedback ao usuário
      Alert.alert("Erro de Conexão", "Não foi possível carregar os horários. Verifique sua conexão com a internet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHourSlots();
  }, [arenaId, quadraId, selectedDate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleHourSelect = (hour: number, hasVideos: boolean, videoCount: number) => {
    if (!hasVideos) {
      Alert.alert(
        'Sem Vídeos',
        'Não há vídeos disponíveis para este horário.',
        [{ text: 'OK' }]
      );
      return;
    }

    setSelectedHour(hour);
    Alert.alert(
      'Horário Selecionado',
      `Encontrados ${videoCount} vídeo${videoCount > 1 ? 's' : ''} das ${hour}:00 às ${hour}:59`,
      [
        { text: 'Voltar', style: 'cancel' },
        { 
          text: 'Ver Vídeos', 
          onPress: () => navigation.navigate('VideoList', {
            arenaId,
            arenaName,
            selectedDate,
            quadraId,
            quadraName,
            selectedHour: hour,
            videoCount: videoCount
          })
        }
      ]
    );
  };

  const getHourPeriod = (hour: number) => {
    if (hour >= 6 && hour < 12) return 'Manhã';
    if (hour >= 12 && hour < 18) return 'Tarde';
    return 'Noite';
  };

  const groupedSlots = hourSlots.reduce((groups: { [key: string]: HourSlot[] }, slot) => {
    const period = getHourPeriod(slot.hour);
    if (!groups[period]) groups[period] = [];
    groups[period].push(slot);
    return groups;
  }, {});

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Selecionar Horário</Text>
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
            <Video size={16} color="#1e3a8a" />
            <Text style={styles.infoText}>{quadraName}</Text>
          </View>
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Escolha o Horário</Text>
          <Text style={styles.instructionsText}>
            Selecione o horário para ver todos os vídeos capturados naquele período
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1e3a8a" />
            <Text style={styles.loadingText}>Carregando horários disponíveis...</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {Object.entries(groupedSlots).map(([period, slots]) => (
              <View key={period} style={styles.periodSection}>
                <Text style={styles.periodTitle}>{period}</Text>
                
                <View style={styles.hourGrid}>
                  {slots.map((slot) => (
                    <TouchableOpacity
                      key={slot.hour}
                      style={[
                        styles.hourCard,
                        !slot.hasVideos && styles.hourCardDisabled,
                        selectedHour === slot.hour && styles.hourCardSelected
                      ]}
                      onPress={() => handleHourSelect(slot.hour, slot.hasVideos, slot.videoCount)}
                    >
                      <View style={styles.hourHeader}>
                        <Clock 
                          size={20} 
                          color={slot.hasVideos ? '#1e3a8a' : '#9CA3AF'} 
                        />
                        <Text style={[
                          styles.hourTime,
                          !slot.hasVideos && styles.textDisabled
                        ]}>
                          {slot.displayHour}
                        </Text>
                      </View>
                      
                      <View style={styles.hourFooter}>
                        <Text style={[
                          styles.videoCount,
                          !slot.hasVideos && styles.textDisabled
                        ]}>
                          {slot.videoCount}
                        </Text>
                        <Text style={[
                          styles.videoLabel,
                          !slot.hasVideos && styles.textDisabled
                        ]}>
                          {slot.hasVideos ? 'vídeos' : 'sem vídeos'}
                        </Text>
                      </View>

                      {slot.hasVideos && (
                        <View style={styles.availableDot} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
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
  periodSection: {
    marginBottom: 24,
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    paddingLeft: 4,
  },
  hourGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  hourCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '30%',
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  hourCardDisabled: {
    backgroundColor: '#F3F4F6',
  },
  hourCardSelected: {
    borderWidth: 2,
    borderColor: '#1e3a8a',
  },
  hourHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  hourTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 4,
  },
  hourFooter: {
    alignItems: 'center',
  },
  videoCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  videoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  textDisabled: {
    color: '#9CA3AF',
  },
  availableDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
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
    textAlign: 'center',
  },
});

export default HourSelectionScreen;
