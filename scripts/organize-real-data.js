/**
 * Script para organizar dados reais no Firebase
 * Remove dados fictícios e organiza por arenas reais
 */

const admin = require('firebase-admin');

// IMPORTANTE: Descomente e configure as credenciais antes de usar
// const serviceAccount = require('./path/to/serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://your-project-id.firebaseio.com'
// });

// const db = admin.firestore();

// Configuração das arenas reais
const REAL_ARENAS = [
  {
    id: 'arena_sport_center',
    name: 'Arena Sport Center',
    address: 'Rua das Palmeiras, 123 - Boa Viagem, Recife',
    status: 'active',
    totalQuadras: 3,
    description: 'Arena principal com 3 quadras profissionais'
  },
  {
    id: 'arena_beach_club',
    name: 'Beach Club Recife',
    address: 'Av. Beira Mar, 456 - Pina, Recife',
    status: 'active',
    totalQuadras: 2,
    description: 'Arena na praia com 2 quadras de areia'
  }
];

// Configuração das quadras reais
const REAL_QUADRAS = [
  // Arena Sport Center
  {
    id: 'quadra_1',
    arenaId: 'arena_sport_center',
    name: 'Quadra Principal',
    description: 'Câmera frontal HD - Vista completa da quadra',
    status: 'active',
    cameraType: 'HD Frontal',
    position: 'frontal'
  },
  {
    id: 'quadra_2',
    arenaId: 'arena_sport_center',
    name: 'Quadra Lateral',
    description: 'Câmera lateral - Vista lateral da quadra',
    status: 'active',
    cameraType: 'HD Lateral',
    position: 'lateral'
  },
  {
    id: 'quadra_3',
    arenaId: 'arena_sport_center',
    name: 'Quadra Panorâmica',
    description: 'Câmera panorâmica - Vista aérea da quadra',
    status: 'active',
    cameraType: 'HD Panorâmica',
    position: 'aerea'
  },
  
  // Beach Club Recife
  {
    id: 'quadra_beach_1',
    arenaId: 'arena_beach_club',
    name: 'Quadra Praia Norte',
    description: 'Câmera da quadra norte da praia',
    status: 'active',
    cameraType: 'HD Resistente',
    position: 'frontal'
  },
  {
    id: 'quadra_beach_2',
    arenaId: 'arena_beach_club',
    name: 'Quadra Praia Sul',
    description: 'Câmera da quadra sul da praia',
    status: 'active',
    cameraType: 'HD Resistente',
    position: 'lateral'
  }
];

// Função para criar arenas reais
async function createRealArenas() {
  try {
    console.log('🏟️ Criando arenas reais...');
    
    const arenasRef = db.collection('arenas');
    
    for (const arena of REAL_ARENAS) {
      await arenasRef.doc(arena.id).set({
        ...arena,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`  ✅ Arena criada: ${arena.name}`);
    }
    
    console.log(`🎉 ${REAL_ARENAS.length} arenas criadas com sucesso!`);
    
  } catch (error) {
    console.error('❌ Erro ao criar arenas:', error);
  }
}

// Função para criar quadras reais
async function createRealQuadras() {
  try {
    console.log('🎯 Criando quadras reais...');
    
    const quadrasRef = db.collection('quadras');
    
    for (const quadra of REAL_QUADRAS) {
      await quadrasRef.doc(quadra.id).set({
        ...quadra,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`  ✅ Quadra criada: ${quadra.name} (${quadra.arenaId})`);
    }
    
    console.log(`🎉 ${REAL_QUADRAS.length} quadras criadas com sucesso!`);
    
  } catch (error) {
    console.error('❌ Erro ao criar quadras:', error);
  }
}

// Função para organizar vídeos existentes
async function organizeExistingVideos() {
  try {
    console.log('📹 Organizando vídeos existentes...');
    
    const videosRef = db.collection('videos');
    const snapshot = await videosRef.get();
    
    if (snapshot.empty) {
      console.log('❌ Nenhum vídeo encontrado.');
      return;
    }
    
    console.log(`📊 Encontrados ${snapshot.size} vídeos para organizar...`);
    
    let videosOrganizados = 0;
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const updates = {};
      let needsUpdate = false;
      
      // Verificar e corrigir arenaId
      if (!data.arenaId || data.arenaId === 'arena1' || data.arenaId === 'arena2') {
        updates.arenaId = 'arena_sport_center'; // Arena padrão
        needsUpdate = true;
        console.log(`  🏟️ Corrigindo arenaId para: ${data.title}`);
      }
      
      // Verificar e corrigir quadraId
      if (!data.quadraId || data.quadraId === 'quadra1' || data.quadraId === 'quadra2') {
        // Distribuir entre as quadras reais
        const quadraIndex = videosOrganizados % 3; // Rotacionar entre 3 quadras
        updates.quadraId = `quadra_${quadraIndex + 1}`;
        needsUpdate = true;
        console.log(`  🎯 Corrigindo quadraId para: ${data.title}`);
      }
      
      // Verificar e corrigir formato da data
      if (data.date && data.date.includes('/')) {
        // Converter DD/MM/YYYY para YYYY-MM-DD
        const parts = data.date.split('/');
        if (parts.length === 3) {
          updates.date = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          needsUpdate = true;
          console.log(`  📅 Corrigindo formato da data: ${data.date} → ${updates.date}`);
        }
      }
      
      // Verificar e adicionar hour se não existir
      if (data.hour === undefined || data.hour === null) {
        // Extrair hora do timestamp ou usar hora padrão
        let hour = 18; // Valor padrão
        
        if (data.timestamp) {
          const timestampDate = new Date(data.timestamp);
          hour = timestampDate.getHours();
        } else if (data.createdAt && data.createdAt.toDate) {
          hour = data.createdAt.toDate().getHours();
        }
        
        updates.hour = hour;
        needsUpdate = true;
        console.log(`  ⏰ Adicionando hour: ${hour}h para ${data.title}`);
      }
      
      // Verificar e adicionar timestamp se não existir
      if (!data.timestamp) {
        let timestamp;
        
        if (data.date && data.hour !== undefined) {
          // Criar timestamp a partir da data e hora
          const dateStr = updates.date || data.date;
          const hourNum = updates.hour || data.hour;
          timestamp = `${dateStr}T${String(hourNum).padStart(2, '0')}:00:00Z`;
        } else if (data.createdAt && data.createdAt.toDate) {
          timestamp = data.createdAt.toDate().toISOString();
        } else {
          timestamp = new Date().toISOString();
        }
        
        updates.timestamp = timestamp;
        needsUpdate = true;
        console.log(`  🕐 Adicionando timestamp: ${timestamp} para ${data.title}`);
      }
      
      // Verificar e corrigir views (string para number)
      if (typeof data.views === 'string') {
        updates.views = parseInt(data.views) || 0;
        needsUpdate = true;
        console.log(`  👁️ Corrigindo views: "${data.views}" → ${updates.views}`);
      }
      
      // Adicionar campos de metadados se não existirem
      if (!data.updatedAt) {
        updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        needsUpdate = true;
      }
      
      // Aplicar atualizações se necessário
      if (needsUpdate) {
        await doc.ref.update(updates);
        videosOrganizados++;
        console.log(`  ✅ Vídeo organizado: ${data.title}`);
      }
    }
    
    console.log(`🎉 ${videosOrganizados} vídeos organizados com sucesso!`);
    
  } catch (error) {
    console.error('❌ Erro ao organizar vídeos:', error);
  }
}

// Função para remover dados fictícios antigos
async function removeOldMockData() {
  try {
    console.log('🗑️ Removendo dados fictícios antigos...');
    
    const videosRef = db.collection('videos');
    const snapshot = await videosRef.get();
    
    let removidos = 0;
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Identificar vídeos fictícios por características específicas
      const isMockVideo = (
        data.title?.includes('Gol Espetacular') ||
        data.title?.includes('Defesa Incrível') ||
        data.title?.includes('Lance Polêmico') ||
        data.videoUrl?.includes('sample-videos.com') ||
        data.thumbnailUrl?.includes('via.placeholder.com')
      );
      
      if (isMockVideo) {
        await doc.ref.delete();
        removidos++;
        console.log(`  🗑️ Removido vídeo fictício: ${data.title}`);
      }
    }
    
    console.log(`🎉 ${removidos} vídeos fictícios removidos!`);
    
  } catch (error) {
    console.error('❌ Erro ao remover dados fictícios:', error);
  }
}

// Função para listar estatísticas finais
async function showStatistics() {
  try {
    console.log('\n📊 ESTATÍSTICAS FINAIS:');
    
    // Contar arenas
    const arenasSnapshot = await db.collection('arenas').get();
    console.log(`🏟️ Arenas: ${arenasSnapshot.size}`);
    
    // Contar quadras
    const quadrasSnapshot = await db.collection('quadras').get();
    console.log(`🎯 Quadras: ${quadrasSnapshot.size}`);
    
    // Contar vídeos por arena
    const videosSnapshot = await db.collection('videos').get();
    console.log(`📹 Total de vídeos: ${videosSnapshot.size}`);
    
    const videosByArena = {};
    videosSnapshot.forEach(doc => {
      const data = doc.data();
      const arenaId = data.arenaId || 'sem_arena';
      videosByArena[arenaId] = (videosByArena[arenaId] || 0) + 1;
    });
    
    console.log('\n📈 Vídeos por arena:');
    Object.entries(videosByArena).forEach(([arenaId, count]) => {
      console.log(`  ${arenaId}: ${count} vídeos`);
    });
    
    // Verificar campos obrigatórios
    let videosCompletos = 0;
    videosSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.arenaId && data.quadraId && data.hour !== undefined && data.timestamp) {
        videosCompletos++;
      }
    });
    
    console.log(`\n✅ Vídeos com todos os campos obrigatórios: ${videosCompletos}/${videosSnapshot.size}`);
    
  } catch (error) {
    console.error('❌ Erro ao gerar estatísticas:', error);
  }
}

// Função principal
async function organizeRealData() {
  console.log('🚀 INICIANDO ORGANIZAÇÃO DOS DADOS REAIS\n');
  
  try {
    // 1. Remover dados fictícios antigos
    await removeOldMockData();
    console.log('');
    
    // 2. Criar arenas reais
    await createRealArenas();
    console.log('');
    
    // 3. Criar quadras reais
    await createRealQuadras();
    console.log('');
    
    // 4. Organizar vídeos existentes
    await organizeExistingVideos();
    console.log('');
    
    // 5. Mostrar estatísticas finais
    await showStatistics();
    
    console.log('\n🎉 ORGANIZAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('\n📋 PRÓXIMOS PASSOS:');
    console.log('1. Teste o app para verificar se os filtros estão funcionando');
    console.log('2. Adicione vídeos reais usando as arenas e quadras criadas');
    console.log('3. Verifique se o calendário mostra as datas corretas');
    
  } catch (error) {
    console.error('❌ Erro durante a organização:', error);
  }
}

// Exportar funções para uso
module.exports = {
  organizeRealData,
  createRealArenas,
  createRealQuadras,
  organizeExistingVideos,
  removeOldMockData,
  showStatistics,
  REAL_ARENAS,
  REAL_QUADRAS
};

// Se executado diretamente
if (require.main === module) {
  console.log('⚠️ ATENÇÃO: Para usar este script, você precisa:');
  console.log('1. Configurar as credenciais do Firebase Admin SDK');
  console.log('2. Descomentar as linhas de inicialização do Firebase');
  console.log('3. Executar: node scripts/organize-real-data.js');
  console.log('');
  console.log('📋 O que este script fará:');
  console.log(`- Criar ${REAL_ARENAS.length} arenas reais`);
  console.log(`- Criar ${REAL_QUADRAS.length} quadras reais`);
  console.log('- Organizar vídeos existentes com campos corretos');
  console.log('- Remover dados fictícios antigos');
  console.log('- Gerar relatório final');
  
  // organizeRealData(); // Descomente para executar
}