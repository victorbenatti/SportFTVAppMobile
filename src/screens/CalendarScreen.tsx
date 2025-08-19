import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Calendar, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { db } from '../services/firebase';
import { collection, getDocs, query, where } from '@react-native-firebase/firestore';

type CalendarScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Calendar'>;
type CalendarScreenRouteProp = RouteProp<RootStackParamList, 'Calendar'>;

interface DateInfo {
  date: Date;
  dateString: string;
  dayNumber: number;
  dayName: string;
  month: string;
  isToday: boolean;
  hasVideos: boolean;
  videoCount: number;
}

interface CalendarScreenProps {}

const CalendarScreenImproved: React.FC<CalendarScreenProps> = () => {
  const navigation = useNavigation<CalendarScreenNavigationProp>();
  const route = useRoute<CalendarScreenRouteProp>();
  const { arenaId, arenaName } = route.params;
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [datesWithVideos, setDatesWithVideos] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [videoCountByDate, setVideoCountByDate] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    fetchVideoDates();
  }, [arenaId, currentMonth]);

  const fetchVideoDates = async () => {
    try {
      setLoading(true);
      
      // Buscar todas as datas que têm vídeos para esta arena
      const videosCollection = collection(db, 'videos');
      
      // Buscar vídeos do mês atual e adjacentes para melhor UX
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      // Expandir busca para incluir mês anterior e próximo
      const startDate = new Date(startOfMonth);
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date(endOfMonth);
      endDate.setMonth(endDate.getMonth() + 1);
      
      const startDateString = startDate.toISOString().split('T')[0];
      const endDateString = endDate.toISOString().split('T')[0];
      
      let videosQuery = query(videosCollection);
      
      // Aplicar filtro por arena se disponível
      if (arenaId && arenaId !== 'all') {
        try {
          videosQuery = query(videosQuery, where('arenaId', '==', arenaId));
        } catch (error) {
          console.log('ArenaId field not found, fetching all videos');
        }
      }
      
      const snapshot = await getDocs(videosQuery);
      const datesSet = new Set<string>();
      const countMap = new Map<string, number>();
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        let videoDate = '';
        
        // Tentar extrair data de diferentes campos
        if (data.date) {
          // Converter diferentes formatos de data para YYYY-MM-DD
          if (data.date.includes('/')) {
            // Formato DD/MM/YYYY ou MM/DD/YYYY
            const parts = data.date.split('/');
            if (parts.length === 3) {
              // Assumir DD/MM/YYYY (formato brasileiro)
              videoDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
          } else if (data.date.includes('-')) {
            // Já está em formato YYYY-MM-DD
            videoDate = data.date;
          }
        } else if (data.timestamp) {
          // Extrair data do timestamp
          videoDate = data.timestamp.split('T')[0];
        } else if (data.createdAt) {
          // Usar createdAt como fallback
          const createdDate = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          videoDate = createdDate.toISOString().split('T')[0];
        }
        
        if (videoDate && videoDate >= startDateString && videoDate <= endDateString) {
          datesSet.add(videoDate);
          countMap.set(videoDate, (countMap.get(videoDate) || 0) + 1);
        }
      });
      
      setDatesWithVideos(datesSet);
      setVideoCountByDate(countMap);
      
    } catch (error) {
      console.error('Erro ao buscar datas com vídeos:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthDates = (): DateInfo[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    
    const dates: DateInfo[] = [];
    
    // Adicionar dias vazios do início do mês
    const startDayOfWeek = firstDay.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      const emptyDate = new Date(year, month, -startDayOfWeek + i + 1);
      dates.push({
        date: emptyDate,
        dateString: emptyDate.toISOString().split('T')[0],
        dayNumber: emptyDate.getDate(),
        dayName: '',
        month: '',
        isToday: false,
        hasVideos: false,
        videoCount: 0
      });
    }
    
    // Adicionar todos os dias do mês
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const isToday = dateString === today.toISOString().split('T')[0];
      const hasVideos = datesWithVideos.has(dateString);
      const videoCount = videoCountByDate.get(dateString) || 0;
      
      dates.push({
        date,
        dateString,
        dayNumber: day,
        dayName: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        isToday,
        hasVideos,
        videoCount
      });
    }
    
    return dates;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const handleDateSelect = (dateInfo: DateInfo) => {
    if (!dateInfo.hasVideos) {
      // Mostrar mensagem se não há vídeos nesta data
      return;
    }
    
    setSelectedDate(dateInfo.dateString);
    // Navegar para seleção de quadras
    navigation.navigate('QuadraSelection', {
      arenaId,
      arenaName,
      selectedDate: dateInfo.dateString
    });
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const dates = generateMonthDates();
  const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

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
        {/* Cabeçalho do Calendário */}
        <View style={styles.calendarHeader}>
          <Calendar size={20} color="#1e3a8a" />
          <Text style={styles.calendarTitle}>Escolha o dia dos vídeos</Text>
        </View>

        {/* Navegação do Mês */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.navButton}>
            <ChevronLeft size={24} color="#1e3a8a" />
          </TouchableOpacity>
          
          <View style={styles.monthInfo}>
            <Text style={styles.monthName}>{monthName}</Text>
            <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
              <Text style={styles.todayButtonText}>Hoje</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.navButton}>
            <ChevronRight size={24} color="#1e3a8a" />
          </TouchableOpacity>
        </View>

        {/* Dias da Semana */}
        <View style={styles.weekDaysHeader}>
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <Text key={day} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1e3a8a" />
            <Text style={styles.loadingText}>Carregando datas com vídeos...</Text>
          </View>
        )}

        {/* Grid do Calendário */}
        {!loading && (
          <View style={styles.calendarGrid}>
            {dates.map((dateInfo, index) => {
              const isCurrentMonth = dateInfo.date.getMonth() === currentMonth.getMonth();
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCell,
                    !isCurrentMonth && styles.dateCellOtherMonth,
                    dateInfo.isToday && styles.todayCell,
                    dateInfo.hasVideos && styles.dateWithVideos,
                    selectedDate === dateInfo.dateString && styles.selectedDateCell
                  ]}
                  onPress={() => isCurrentMonth && handleDateSelect(dateInfo)}
                  disabled={!isCurrentMonth || !dateInfo.hasVideos}
                >
                  <Text style={[
                    styles.dateCellText,
                    !isCurrentMonth && styles.dateCellTextOtherMonth,
                    dateInfo.isToday && styles.todayText,
                    dateInfo.hasVideos && styles.dateWithVideosText,
                    selectedDate === dateInfo.dateString && styles.selectedDateText
                  ]}>
                    {dateInfo.dayNumber}
                  </Text>
                  
                  {dateInfo.hasVideos && (
                    <View style={styles.videosIndicator}>
                      <Text style={styles.videosCount}>{dateInfo.videoCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Legenda */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.todayDot]} />
            <Text style={styles.legendText}>Hoje</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.videosAvailableDot]} />
            <Text style={styles.legendText}>Vídeos disponíveis</Text>
          </View>
        </View>

        {/* Informações */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Toque em uma data destacada para ver os vídeos disponíveis.
            {datesWithVideos.size === 0 && ' Nenhum vídeo encontrado para esta arena.'}
          </Text>
        </View>
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
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  monthInfo: {
    alignItems: 'center',
  },
  monthName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#10B981',
    borderRadius: 12,
  },
  todayButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCell: {
    width: '14.28%', // 7 dias por semana
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 4,
  },
  dateCellOtherMonth: {
    opacity: 0.3,
  },
  todayCell: {
    backgroundColor: '#10B981',
    borderRadius: 8,
  },
  dateWithVideos: {
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e3a8a',
  },
  selectedDateCell: {
    backgroundColor: '#1e3a8a',
    borderRadius: 8,
  },
  dateCellText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  dateCellTextOtherMonth: {
    color: '#9CA3AF',
  },
  todayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dateWithVideosText: {
    color: '#1e3a8a',
    fontWeight: '600',
  },
  selectedDateText: {
    color: 'white',
    fontWeight: 'bold',
  },
  videosIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videosCount: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  todayDot: {
    backgroundColor: '#10B981',
  },
  videosAvailableDot: {
    backgroundColor: '#1e3a8a',
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoContainer: {
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
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
});

export default CalendarScreenImproved;