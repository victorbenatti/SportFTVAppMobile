import { collection, addDoc, Timestamp } from 'firebase/firestore';
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

// Função para criar um documento de vídeo com valores padrão
export const createVideoDocument = async (videoData: VideoData) => {
  try {
    // Valores padrão
    const defaultData = {
      title: videoData.title,
      videoUrl: videoData.videoUrl,
      date: videoData.date || new Date().toLocaleDateString('pt-BR'),
      tournament: videoData.tournament || 'Torneio Padrão',
      description: videoData.description || 'Descrição não informada',
      thumbnailUrl: videoData.thumbnailUrl || '',
      duration: videoData.duration || '0:00',
      views: videoData.views || 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    // Adicionar documento à coleção 'videos'
    const docRef = await addDoc(collection(db, 'videos'), defaultData);
    
    console.log('Documento criado com ID:', docRef.id);
    return { success: true, id: docRef.id, data: defaultData };
  } catch (error) {
    console.error('Erro ao criar documento:', error);
    return { success: false, error };
  }
};

// Função para criar múltiplos vídeos de teste
export const createTestVideos = async () => {
  const testVideos = [
    {
      title: 'Vídeo Teste 1',
      videoUrl: 'https://firebasestorage.googleapis.com/v0/b/sport-ftv/o/videos%2Fteste1.mp4?alt=media',
      tournament: 'Campeonato de Teste',
      description: 'Primeiro vídeo de teste'
    },
    {
      title: 'Vídeo Teste 2',
      videoUrl: 'https://firebasestorage.googleapis.com/v0/b/sport-ftv/o/videos%2Fteste2.mp4?alt=media',
      tournament: 'Liga de Teste',
      description: 'Segundo vídeo de teste',
      duration: '01:30'
    },
    {
      title: 'Vídeo Teste 3',
      videoUrl: 'https://firebasestorage.googleapis.com/v0/b/sport-ftv/o/videos%2Fteste3.mp4?alt=media',
      tournament: 'Copa de Teste',
      views: 10
    }
  ];

  try {
    const results = [];
    for (const video of testVideos) {
      const result = await createVideoDocument(video);
      results.push(result);
    }
    
    console.log('Vídeos de teste criados:', results);
    return results;
  } catch (error) {
    console.error('Erro ao criar vídeos de teste:', error);
    return { success: false, error };
  }
};

// Função para adicionar um vídeo ao Firestore
export const addVideoToFirestore = async (videoData: VideoData) => {
  try {
    const videosCollection = collection(db, 'videos');
    
    // Validar campos essenciais
    if (!videoData.arenaId || !videoData.quadraId || !videoData.date || videoData.hour === undefined) {
      throw new Error('Campos essenciais obrigatórios: arenaId, quadraId, date, hour');
    }
    
    const docData = {
      ...videoData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      // Garantir timestamp se não fornecido
      timestamp: videoData.timestamp || new Date().toISOString(),
      // Garantir campos padrão
      description: videoData.description || 'Descrição não informada',
      thumbnailUrl: videoData.thumbnailUrl || '',
      duration: videoData.duration || '0:00',
      views: videoData.views || 0
    };
    
    const docRef = await addDoc(videosCollection, docData);
    console.log('Vídeo adicionado com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar vídeo:', error);
    throw error;
  }
};

// Função rápida para criar um vídeo simples com campos essenciais
export const quickCreateVideo = async (
  title: string, 
  videoUrl: string, 
  arenaId: string,
  quadraId: string,
  date: string,
  hour: number,
  tournament?: string
) => {
  return await addVideoToFirestore({
    title,
    videoUrl,
    arenaId,
    quadraId,
    date,
    hour,
    tournament
  });
};

// Função para validar se um vídeo tem todos os campos essenciais
export const validateVideoData = (videoData: any): boolean => {
  const requiredFields = ['arenaId', 'quadraId', 'date', 'hour'];
  
  for (const field of requiredFields) {
    if (!videoData[field] && videoData[field] !== 0) {
      console.warn(`Campo essencial ausente: ${field}`);
      return false;
    }
  }
  
  return true;
};

// Função para buscar vídeos com filtros essenciais
export const getVideosWithFilters = async (filters: {
  arenaId?: string;
  quadraId?: string;
  date?: string;
  hour?: number;
}) => {
  try {
    const videosCollection = collection(db, 'videos');
    let q = videosCollection;
    
    // Aplicar filtros apenas se fornecidos
    if (filters.arenaId) {
      q = query(q, where('arenaId', '==', filters.arenaId));
    }
    if (filters.quadraId) {
      q = query(q, where('quadraId', '==', filters.quadraId));
    }
    if (filters.date) {
      q = query(q, where('date', '==', filters.date));
    }
    if (filters.hour !== undefined) {
      q = query(q, where('hour', '==', filters.hour));
    }
    
    // Ordenar por timestamp
    q = query(q, orderBy('timestamp', 'desc'));
    
    const snapshot = await getDocs(q);
    const videos = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (validateVideoData(data)) {
        videos.push({ id: doc.id, ...data });
      }
    });
    
    return videos;
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    throw error;
  }
};