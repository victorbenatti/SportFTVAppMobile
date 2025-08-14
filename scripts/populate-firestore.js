// Script para popular o Firestore com dados de exemplo
// Execute este script para adicionar vídeos de teste ao banco de dados

const admin = require('firebase-admin');
const path = require('path');

// Inicializar Firebase Admin (você precisa configurar as credenciais)
// const serviceAccount = require('./path/to/serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://your-project-id.firebaseio.com'
// });

// const db = admin.firestore();

// Dados de exemplo para popular o Firestore
const sampleVideos = [
  {
    title: 'Gol Espetacular - Final do Campeonato',
    description: 'Momento decisivo da partida final com um gol incrível',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnailUrl: 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Gol+Espetacular',
    duration: '2:45',
    date: '2024-01-15',
    tournament: 'Campeonato Regional',
    views: 1250,
    arenaId: 'arena1',
    quadraId: 'quadra1',
    hour: 18,
    timestamp: '2024-01-15T18:30:00Z'
  },
  {
    title: 'Defesa Incrível do Goleiro',
    description: 'Defesa que salvou o jogo no último minuto',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    thumbnailUrl: 'https://via.placeholder.com/300x200/3498db/ffffff?text=Defesa+Incrivel',
    duration: '1:30',
    date: '2024-01-15',
    tournament: 'Campeonato Regional',
    views: 890,
    arenaId: 'arena1',
    quadraId: 'quadra2',
    hour: 19,
    timestamp: '2024-01-15T19:45:00Z'
  },
  {
    title: 'Jogada Ensaiada Perfeita',
    description: 'Execução perfeita de jogada ensaiada durante o treino',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
    thumbnailUrl: 'https://via.placeholder.com/300x200/2ecc71/ffffff?text=Jogada+Ensaiada',
    duration: '3:20',
    date: '2024-01-16',
    tournament: 'Treino Tático',
    views: 2100,
    arenaId: 'arena2',
    quadraId: 'quadra1',
    hour: 16,
    timestamp: '2024-01-16T16:20:00Z'
  },
  {
    title: 'Lance Polêmico - Pênalti',
    description: 'Lance que gerou muita discussão entre os torcedores',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnailUrl: 'https://via.placeholder.com/300x200/f39c12/ffffff?text=Lance+Polemico',
    duration: '1:15',
    date: '2024-01-16',
    tournament: 'Campeonato Regional',
    views: 3200,
    arenaId: 'arena1',
    quadraId: 'quadra3',
    hour: 20,
    timestamp: '2024-01-16T20:10:00Z'
  },
  {
    title: 'Comemoração da Torcida',
    description: 'Torcida em festa após o gol da vitória',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    thumbnailUrl: 'https://via.placeholder.com/300x200/9b59b6/ffffff?text=Comemoracao',
    duration: '2:00',
    date: '2024-01-17',
    tournament: 'Campeonato Regional',
    views: 750,
    arenaId: 'arena2',
    quadraId: 'quadra2',
    hour: 17,
    timestamp: '2024-01-17T17:00:00Z'
  },
  {
    title: 'Treino de Finalizações',
    description: 'Sessão de treino focada em finalizações',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnailUrl: 'https://via.placeholder.com/300x200/e67e22/ffffff?text=Treino+Finalizacoes',
    duration: '4:30',
    date: '2024-01-17',
    tournament: 'Treino',
    views: 420,
    arenaId: 'arena1',
    quadraId: 'quadra1',
    hour: 15,
    timestamp: '2024-01-17T15:30:00Z'
  },
  {
    title: 'Falta Ensaiada - Gol de Falta',
    description: 'Cobrança de falta que resultou em gol espetacular',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    thumbnailUrl: 'https://via.placeholder.com/300x200/8e44ad/ffffff?text=Gol+de+Falta',
    duration: '1:45',
    date: '2024-01-18',
    tournament: 'Campeonato Regional',
    views: 1800,
    arenaId: 'arena2',
    quadraId: 'quadra3',
    hour: 19,
    timestamp: '2024-01-18T19:25:00Z'
  },
  {
    title: 'Aquecimento da Equipe',
    description: 'Rotina de aquecimento antes da partida',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnailUrl: 'https://via.placeholder.com/300x200/16a085/ffffff?text=Aquecimento',
    duration: '3:00',
    date: '2024-01-18',
    tournament: 'Pré-jogo',
    views: 320,
    arenaId: 'arena1',
    quadraId: 'quadra2',
    hour: 14,
    timestamp: '2024-01-18T14:00:00Z'
  }
];

// Função para adicionar os vídeos ao Firestore
async function populateFirestore() {
  try {
    console.log('Iniciando população do Firestore...');
    
    for (const video of sampleVideos) {
      const docData = {
        ...video,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now()
      };
      
      const docRef = await db.collection('videos').add(docData);
      console.log(`Vídeo adicionado com ID: ${docRef.id} - ${video.title}`);
    }
    
    console.log('População do Firestore concluída com sucesso!');
    console.log(`Total de vídeos adicionados: ${sampleVideos.length}`);
    
  } catch (error) {
    console.error('Erro ao popular Firestore:', error);
  }
}

// Função para limpar a coleção de vídeos (use com cuidado!)
async function clearVideosCollection() {
  try {
    console.log('Limpando coleção de vídeos...');
    
    const snapshot = await db.collection('videos').get();
    const batch = db.batch();
    
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('Coleção de vídeos limpa com sucesso!');
    
  } catch (error) {
    console.error('Erro ao limpar coleção:', error);
  }
}

// Exportar funções para uso
module.exports = {
  populateFirestore,
  clearVideosCollection,
  sampleVideos
};

// Se executado diretamente, popular o Firestore
if (require.main === module) {
  console.log('ATENÇÃO: Para usar este script, você precisa:');
  console.log('1. Configurar as credenciais do Firebase Admin SDK');
  console.log('2. Descomentar as linhas de inicialização do Firebase');
  console.log('3. Executar: node scripts/populate-firestore.js');
  console.log('');
  console.log('Dados de exemplo preparados:');
  console.log(`- ${sampleVideos.length} vídeos`);
  console.log('- Distribuídos entre 2 arenas e 3 quadras');
  console.log('- Com diferentes horários e datas');
  console.log('- Incluindo thumbnails e metadados completos');
}