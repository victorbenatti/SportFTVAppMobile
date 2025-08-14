import React, { useState } from 'react';
import { SafeAreaView, FlatList, View, Text, StyleSheet, Alert, RefreshControl } from 'react-native';
import VideoCard from '../components/VideoCard';

// Dados mock para teste
const mockVideos = [
  {
    id: '1',
    title: 'Gol Espetacular do Sport',
    description: 'Lance incrível da partida contra o rival',
    thumbnailUrl: 'https://via.placeholder.com/300x200.png?text=Sport+FTV+1',
    videoUrl: 'https://example.com/video1.mp4',
    duration: '2:30',
    date: '2025-08-10'
  },
  {
    id: '2',
    title: 'Defesa Milagrosa',
    description: 'Goleiro faz defesa impossível',
    thumbnailUrl: 'https://via.placeholder.com/300x200.png?text=Sport+FTV+2',
    videoUrl: 'https://example.com/video2.mp4',
    duration: '1:45',
    date: '2025-08-09'
  },
  {
    id: '3',
    title: 'Comemoração da Torcida',
    description: 'Torcida explode de alegria após gol',
    thumbnailUrl: 'https://via.placeholder.com/300x200.png?text=Sport+FTV+3',
    videoUrl: 'https://example.com/video3.mp4',
    duration: '3:15',
    date: '2025-08-08'
  }
];

const BestMomentsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simula carregamento de novos dados
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert("Atualizado!", "Lista de vídeos atualizada com sucesso!");
    }, 2000);
  };

  const handleVideoClick = (video: any) => {
    Alert.alert(
      video.title,
      video.description,
      [
        { text: "Fechar", style: "cancel" },
        { text: "Assistir", onPress: () => console.log(`Assistindo: ${video.title}`) }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sport FTV</Text>
        <Text style={styles.subtitle}>Melhores Momentos</Text>
      </View>
      
      <FlatList
        data={mockVideos}
        renderItem={({ item }) => (
          <VideoCard
            id={item.id}
            title={item.title}
            description={item.description}
            thumbnail={item.thumbnailUrl}
            videoUrl={item.videoUrl}
            duration={item.duration}
            date={item.date}
            onClick={() => handleVideoClick(item)}
          />
        )}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1e3a8a']}
            tintColor="#1e3a8a"
          />
        }
      />
    </SafeAreaView>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
  },
});

export default BestMomentsScreen;
