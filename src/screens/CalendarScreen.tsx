import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Calendar, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { db } from '../services/firebase';
import { collection, getDocs, query, where } from '@react-native-firebase/firestore';

type CalendarScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Calendar'>;
type CalendarScreenRouteProp = RouteProp<RootStackParamList, 'Calendar'>;

interface CalendarScreenProps {}

const CalendarScreen: React.FC<CalendarScreenProps> = () => {
  const navigation = useNavigation<CalendarScreenNavigationProp>();
  const route = useRoute<CalendarScreenRouteProp>();
  const { arenaId, arenaName } = route.params;
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  
  // Buscar datas com vídeos disponíveis no Firebase
  const fetchAvailableDates = async () => {
    try {
      setLoading(true);
      console.log('Buscando datas disponíveis para arena:', arenaId);
      
      if (!arenaId) {
        console.warn('ArenaId não fornecido');
        return;
      }

      const videosCollection = collection(db, 'videos');
      const videosQuery = query(
        videosCollection,
        where('arenaId', '==', arenaId)
      );
      
      const videosSnapshot = await getDocs(videosQuery);
      const dates = new Set<string>();
      
      videosSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.date && data.arenaId === arenaId) {
          dates.add(data.date);
        }
      });
      
      console.log(`Encontradas ${dates.size} datas com vídeos:`, Array.from(dates));
      setAvailableDates(dates);
    } catch (error) {
      console.error('Erro ao buscar datas disponíveis:', error);
      Alert.alert('Erro', 'Não foi possível carregar as datas disponíveis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableDates();
  }, [arenaId]);

  // Gera os últimos 30 dias e próximos 30 dias
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    // Últimos 30 dias
    for (let i = 30; i >= 1; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dateString = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
      const dayNumber = date.getDate();
      const month = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      dates.push({
        dateString,
        dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        dayNumber,
        month,
        isToday: false,
        hasVideos: availableDates.has(dateString)
      });
    }
    
    // Hoje e próximos 30 dias
    for (let i = 0; i < 31; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateString = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
      const dayNumber = date.getDate();
      const month = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      dates.push({
        dateString,
        dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        dayNumber,
        month,
        isToday: i === 0,
        hasVideos: availableDates.has(dateString)
      });
    }
    
    return dates;
  };

  const dates = generateDates();

  const handleDateSelect = (dateString: string, hasVideos: boolean) => {
    if (!hasVideos) {
      Alert.alert(
        'Sem vídeos',
        'Não há vídeos disponíveis para esta data.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setSelectedDate(dateString);
    // Navegar para seleção de quadras
    navigation.navigate('QuadraSelection', {
      arenaId,
      arenaName,
      selectedDate: dateString
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{arenaName}</Text>
          <Text style={styles.subtitle}>Selecione uma Data</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.calendarHeader}>
          <Calendar size={20} color="#1e3a8a" />
          <Text style={styles.calendarTitle}>Escolha o dia dos vídeos</Text>
          {loading && (
            <ActivityIndicator size="small" color="#1e3a8a" style={{ marginLeft: 8 }} />
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1e3a8a" />
            <Text style={styles.loadingText}>Carregando datas disponíveis...</Text>
          </View>
        ) : (
          <>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datesContainer}
            >
              {dates.map((date) => (
                <TouchableOpacity
                  key={date.dateString}
                  style={[
                    styles.dateCard,
                    selectedDate === date.dateString && styles.selectedDateCard,
                    date.isToday && styles.todayCard,
                    date.hasVideos && styles.dateWithVideos,
                    !date.hasVideos && styles.dateWithoutVideos
                  ]}
                  onPress={() => handleDateSelect(date.dateString, date.hasVideos)}
                  disabled={!date.hasVideos}
                >
                  <Text style={[
                    styles.dayName,
                    selectedDate === date.dateString && styles.selectedText,
                    date.isToday && styles.todayText,
                    !date.hasVideos && styles.disabledText
                  ]}>
                    {date.dayName}
                  </Text>
                  <Text style={[
                    styles.dayNumber,
                    selectedDate === date.dateString && styles.selectedText,
                    date.isToday && styles.todayText,
                    !date.hasVideos && styles.disabledText
                  ]}>
                    {date.dayNumber}
                  </Text>
                  <Text style={[
                    styles.month,
                    selectedDate === date.dateString && styles.selectedText,
                    date.isToday && styles.todayText,
                    !date.hasVideos && styles.disabledText
                  ]}>
                    {date.month}
                  </Text>
                  {date.isToday && (
                    <View style={styles.todayDot} />
                  )}
                  {date.hasVideos && (
                    <View style={styles.videoDot} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                💡 Datas com ponto verde têm vídeos disponíveis
              </Text>
              <Text style={styles.infoSubText}>
                Total de datas com vídeos: {availableDates.size}
              </Text>
            </View>
          </>
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
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  datesContainer: {
    paddingHorizontal: 8,
  },
  dateCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    minWidth: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDateCard: {
    backgroundColor: '#1e3a8a',
  },
  todayCard: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  dayName: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  month: {
    fontSize: 12,
    color: '#6B7280',
  },
  selectedText: {
    color: 'white',
  },
  todayText: {
    color: '#10B981',
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    position: 'absolute',
    top: 8,
    right: 8,
  },
  videoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  dateWithVideos: {
    borderWidth: 1,
    borderColor: '#10B981',
  },
  dateWithoutVideos: {
    opacity: 0.4,
    backgroundColor: '#F3F4F6',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  infoContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1e3a8a',
  },
  infoText: {
    fontSize: 14,
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 4,
  },
  infoSubText: {
    fontSize: 12,
    color: '#1e3a8a',
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default CalendarScreen;
