// src/utils/firestore-helpers.ts

import firestore, {
  FirebaseFirestoreTypes,
  Timestamp,
} from '@react-native-firebase/firestore';
import { db } from '../services/firebase';

// Interface para dados completos do vídeo com campos essenciais obrigatórios
interface VideoData {
  title: string;
  videoUrl: string;
  // Campos essenciais obrigatórios
  arenaId: string;
  quadraId: string;
  date: string;
  hour: number;
  // Campos opcionais
  description?: string;
  timestamp?: string;
  tournament?: string;
  thumbnailUrl?: string;
  duration?: string;
  views?: number | string;
}

// --- FUNÇÕES REESCRITAS COM A SINTAXE CORRETA ---

// Função para buscar vídeos com filtros essenciais
export const getVideosWithFilters = async (filters: {
  arenaId?: string;
  quadraId?: string;
  date?: string;
  hour?: number;
}) => {
  try {
    // Começamos com a referência para a coleção 'videos'
    let query: FirebaseFirestoreTypes.Query = db.collection('videos');

    // Aplicamos os filtros dinamicamente
    if (filters.arenaId) {
      query = query.where('arenaId', '==', filters.arenaId);
    }
    if (filters.quadraId) {
      query = query.where('quadraId', '==', filters.quadraId);
    }
    if (filters.date) {
      query = query.where('date', '==', filters.date);
    }
    if (filters.hour !== undefined) {
      query = query.where('hour', '==', filters.hour);
    }

    // Adicionamos a ordenação
    query = query.orderBy('timestamp', 'desc');

    const snapshot = await query.get();

    if (snapshot.empty) {
      return [];
    }

    const videos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return videos;
  } catch (error) {
    console.error('Erro ao buscar vídeos com filtros:', error);
    // Lançamos o erro para que a tela que chamou a função possa tratá-lo
    throw error;
  }
};

// Função para adicionar um vídeo ao Firestore
export const addVideoToFirestore = async (videoData: VideoData) => {
  try {
    const videosCollection = db.collection('videos');
    
    // Validar campos essenciais
    if (!videoData.arenaId || !videoData.quadraId || !videoData.date || videoData.hour === undefined) {
      throw new Error('Campos essenciais obrigatórios: arenaId, quadraId, date, hour');
    }
    
    const docData = {
      ...videoData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      timestamp: videoData.timestamp || new Date().toISOString(),
      description: videoData.description || 'Descrição não informada',
      thumbnailUrl: videoData.thumbnailUrl || '',
      duration: videoData.duration || '0:00',
      views: videoData.views || 0,
    };
    
    const docRef = await videosCollection.add(docData);
    console.log('Vídeo adicionado com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar vídeo:', error);
    throw error;
  }
};

// As outras funções de teste podem ser mantidas ou removidas se não estiverem em uso.
// Por clareza, vou omiti-las aqui, mas você pode mantê-las no seu arquivo.