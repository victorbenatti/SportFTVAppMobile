// Script para corrigir campos que estão faltando no Firestore
// Execute este script para adicionar os campos obrigatórios aos vídeos existentes

const admin = require('firebase-admin');

// IMPORTANTE: Descomente e configure suas credenciais antes de usar
// const serviceAccount = require('./serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   projectId: 'SEU_PROJECT_ID_AQUI'
// });

// const db = admin.firestore();

// Função para corrigir campos que estão faltando
async function fixMissingFields() {
  try {
    console.log('🔍 Buscando vídeos no Firestore...');
    
    const videosRef = db.collection('videos');
    const snapshot = await videosRef.get();
    
    if (snapshot.empty) {
      console.log('❌ Nenhum vídeo encontrado na coleção.');
      return;
    }
    
    console.log(`📹 Encontrados ${snapshot.size} vídeos. Verificando campos...`);
    
    let videosCorrigidos = 0;
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const updates = {};
      let needsUpdate = false;
      
      // Verificar e adicionar arenaId se não existir
      if (!data.arenaId) {
        updates.arenaId = 'arena_sport_center'; // Valor padrão
        needsUpdate = true;
        console.log(`  ➕ Adicionando arenaId para: ${data.title}`);
      }
      
      // Verificar e adicionar quadraId se não existir
      if (!data.quadraId) {
        updates.quadraId = 'quadra_1'; // Valor padrão
        needsUpdate = true;
        console.log(`  ➕ Adicionando quadraId para: ${data.title}`);
      }
      
      // Verificar e adicionar hour se não existir
      if (data.hour === undefined || data.hour === null) {
        // Tentar extrair hora do timestamp ou usar hora padrão
        let hour = 18; // Valor padrão
        
        if (data.createdAt && data.createdAt.toDate) {
          hour = data.createdAt.toDate().getHours();
        } else if (data.timestamp) {
          hour = new Date(data.timestamp).getHours();
        }
        
        updates.hour = hour;
        needsUpdate = true;
        console.log(`  ➕ Adicionando hour (${hour}h) para: ${data.title}`);
      }
      
      // Verificar e adicionar timestamp se não existir
      if (!data.timestamp) {
        let timestamp = new Date().toISOString(); // Valor padrão
        
        if (data.createdAt && data.createdAt.toDate) {
          timestamp = data.createdAt.toDate().toISOString();
        } else if (data.date) {
          // Tentar converter data para timestamp
          const dateStr = data.date.includes('/') 
            ? data.date.split('/').reverse().join('-') // DD/MM/YYYY -> YYYY-MM-DD
            : data.date;
          timestamp = new Date(dateStr).toISOString();
        }
        
        updates.timestamp = timestamp;
        needsUpdate = true;
        console.log(`  ➕ Adicionando timestamp para: ${data.title}`);
      }
      
      // Corrigir formato da data se necessário
      if (data.date && data.date.includes('/')) {
        // Converter DD/MM/YYYY para YYYY-MM-DD
        const [day, month, year] = data.date.split('/');
        updates.date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        needsUpdate = true;
        console.log(`  🔄 Corrigindo formato da data para: ${data.title}`);
      }
      
      // Corrigir views se for string
      if (typeof data.views === 'string') {
        updates.views = parseInt(data.views) || 0;
        needsUpdate = true;
        console.log(`  🔄 Convertendo views para number: ${data.title}`);
      }
      
      // Aplicar atualizações se necessário
      if (needsUpdate) {
        await doc.ref.update(updates);
        videosCorrigidos++;
        console.log(`  ✅ Vídeo atualizado: ${data.title}`);
      } else {
        console.log(`  ✅ Vídeo já está correto: ${data.title}`);
      }
    }
    
    console.log(`\n🎉 Processo concluído!`);
    console.log(`📊 Vídeos corrigidos: ${videosCorrigidos}/${snapshot.size}`);
    console.log(`\n🚀 Agora teste o app para ver se os filtros funcionam!`);
    
  } catch (error) {
    console.error('❌ Erro ao corrigir campos:', error);
  }
}

// Função para listar vídeos e seus campos
async function listVideosFields() {
  try {
    console.log('📋 Listando campos dos vídeos...');
    
    const videosRef = db.collection('videos');
    const snapshot = await videosRef.get();
    
    if (snapshot.empty) {
      console.log('❌ Nenhum vídeo encontrado.');
      return;
    }
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`\n📹 Vídeo: ${data.title}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   arenaId: ${data.arenaId || '❌ FALTANDO'}`);
      console.log(`   quadraId: ${data.quadraId || '❌ FALTANDO'}`);
      console.log(`   hour: ${data.hour !== undefined ? data.hour : '❌ FALTANDO'}`);
      console.log(`   timestamp: ${data.timestamp || '❌ FALTANDO'}`);
      console.log(`   date: ${data.date}`);
      console.log(`   views: ${data.views} (${typeof data.views})`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao listar vídeos:', error);
  }
}

// Exportar funções
module.exports = {
  fixMissingFields,
  listVideosFields
};

// Executar se chamado diretamente
if (require.main === module) {
  console.log('🔧 SCRIPT DE CORREÇÃO DE CAMPOS DO FIREBASE');
  console.log('==========================================');
  console.log('');
  console.log('⚠️  ANTES DE EXECUTAR:');
  console.log('1. Configure suas credenciais do Firebase Admin SDK');
  console.log('2. Descomente as linhas de inicialização do Firebase');
  console.log('3. Execute: node scripts/fix-firebase-fields.js');
  console.log('');
  console.log('📋 FUNÇÕES DISPONÍVEIS:');
  console.log('- fixMissingFields(): Adiciona campos que estão faltando');
  console.log('- listVideosFields(): Lista todos os vídeos e seus campos');
  console.log('');
  console.log('🎯 ESTE SCRIPT VAI:');
  console.log('✅ Adicionar arenaId (padrão: "arena_sport_center")');
  console.log('✅ Adicionar quadraId (padrão: "quadra_1")');
  console.log('✅ Adicionar hour (extraído do timestamp ou padrão: 18)');
  console.log('✅ Adicionar timestamp (extraído do createdAt ou data atual)');
  console.log('✅ Corrigir formato da data (DD/MM/YYYY → YYYY-MM-DD)');
  console.log('✅ Converter views de string para number');
  console.log('');
  console.log('🚀 Após executar, teste o app para verificar se os filtros funcionam!');
}