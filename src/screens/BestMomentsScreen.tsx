import React, { useState, useEffect } from 'react';
// FlatList é o componente otimizado do React Native para criar listas
import { SafeAreaView, FlatList, Text, ActivityIndicator, View } from 'react-native';

// Importando a lógica que você já tinha!
import { db } from '../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// Importando o componente que já traduzimos
import VideoCard from '../components/VideoCard';

// Interface do vídeo (pode ser movida para um arquivo de types depois)
interface VideoMoment {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl: string;
  duration?: string;
  date: string;
}

const BestMomentsScreen = () => {
  const [videoMoments, setVideoMoments] = useState<VideoMoment[]>([]);
  const [loading, setLoading] = useState(true);

  // A mesma lógica de busca de dados do seu site!
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosCollectionRef = collection(db, 'videos');
        const q = query(videosCollectionRef, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const videosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as VideoMoment[];

        setVideoMoments(videosData);
      } catch (error) {
        console.error("Erro ao buscar vídeos do Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Enquanto carrega, mostra um indicador de atividade
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' }}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={{ marginTop: 16, color: '#6B7280' }}>Buscando melhores momentos...</Text>
      </View>
    );
  }

  return (
    // SafeAreaView garante que o conteúdo não fique embaixo de barras do sistema (como a de status)
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <FlatList
        data={videoMoments}
        // A função renderItem diz como cada item da lista deve ser renderizado
        renderItem={({ item }) => (
          <VideoCard
            id={item.id}
            title={item.title}
            description={item.description || 'Sem descrição'}
            // Usamos a thumbnailUrl do Firestore. Se não tiver, usamos uma imagem padrão.
            thumbnail={item.thumbnailUrl || 'https://via.placeholder.com/300x200.png?text=Sport+FTV'}
            videoUrl={item.videoUrl}
            duration={item.duration || '0:00'}
            date={item.date}
            onClick={() => console.log(`Clicou no vídeo: ${item.title}`)} // Ação temporária
          />
        )}
        keyExtractor={item => item.id}
        // Adiciona um espaçamento entre os cards
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        // Adiciona um padding geral na lista
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
};

export default BestMomentsScreen;