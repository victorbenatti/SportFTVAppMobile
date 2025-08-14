const admin = require('firebase-admin');
const serviceAccount = require('../android/app/google-services.json');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client[0].oauth_client[0].client_id + '@' + serviceAccount.project_id + '.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\n' + process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') + '\n-----END PRIVATE KEY-----\n'
  })
});

const db = admin.firestore();

// URLs de vídeos de teste públicos
const testVideoUrls = [
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4'
];

async function addVideoUrlToExistingVideos() {
  try {
    console.log('🎬 Adicionando URLs de vídeo aos documentos existentes...');
    
    const videosRef = db.collection('videos');
    const snapshot = await videosRef.get();
    
    if (snapshot.empty) {
      console.log('❌ Nenhum vídeo encontrado.');
      return;
    }
    
    console.log(`📊 Encontrados ${snapshot.size} vídeos para atualizar`);
    
    let videosAtualizados = 0;
    let videoIndex = 0;
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const updates = {};
      let needsUpdate = false;
      
      console.log(`\n📹 Processando: ${data.title || 'Sem título'}`);
      console.log(`   ID: ${doc.id}`);
      
      // Adicionar videoUrl se não existir ou estiver vazio
      if (!data.videoUrl || data.videoUrl.trim() === '') {
        updates.videoUrl = testVideoUrls[videoIndex % testVideoUrls.length];
        needsUpdate = true;
        console.log(`   🎥 Adicionando videoUrl: ${updates.videoUrl}`);
      } else {
        console.log(`   ✅ VideoUrl já existe: ${data.videoUrl}`);
      }
      
      // Garantir que tem thumbnailUrl
      if (!data.thumbnailUrl || data.thumbnailUrl.trim() === '') {
        updates.thumbnailUrl = `https://via.placeholder.com/300x200/e74c3c/ffffff?text=Video+${videoIndex + 1}`;
        needsUpdate = true;
        console.log(`   🖼️ Adicionando thumbnailUrl: ${updates.thumbnailUrl}`);
      }
      
      // Garantir campos essenciais para filtros
      if (!data.arenaId) {
        updates.arenaId = 'arena_sport_center';
        needsUpdate = true;
        console.log(`   🏟️ Adicionando arenaId: ${updates.arenaId}`);
      }
      
      if (!data.quadraId) {
        updates.quadraId = `quadra_${(videoIndex % 4) + 1}`;
        needsUpdate = true;
        console.log(`   🎾 Adicionando quadraId: ${updates.quadraId}`);
      }
      
      if (data.hour === undefined || data.hour === null) {
        updates.hour = 14 + (videoIndex % 8); // Horas entre 14h e 21h
        needsUpdate = true;
        console.log(`   🕐 Adicionando hour: ${updates.hour}`);
      }
      
      // Converter data para formato ISO se necessário
      if (data.date && /^\d{2}\/\d{2}\/\d{4}$/.test(data.date)) {
        const [day, month, year] = data.date.split('/');
        updates.date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        needsUpdate = true;
        console.log(`   📅 Convertendo data: ${data.date} → ${updates.date}`);
      }
      
      // Adicionar timestamp se não existir
      if (!data.timestamp) {
        const dateStr = updates.date || data.date || '2025-08-07';
        const hour = updates.hour !== undefined ? updates.hour : (data.hour || 14);
        updates.timestamp = `${dateStr}T${hour.toString().padStart(2, '0')}:30:00Z`;
        needsUpdate = true;
        console.log(`   ⏰ Adicionando timestamp: ${updates.timestamp}`);
      }
      
      // Aplicar atualizações se necessário
      if (needsUpdate) {
        try {
          await doc.ref.update(updates);
          videosAtualizados++;
          console.log(`   ✅ Vídeo atualizado com sucesso!`);
        } catch (error) {
          console.error(`   ❌ Erro ao atualizar vídeo:`, error);
        }
      } else {
        console.log(`   ✅ Vídeo já está completo`);
      }
      
      videoIndex++;
    }
    
    console.log(`\n🎉 Processo concluído!`);
    console.log(`📊 Estatísticas:`);
    console.log(`   ✅ Vídeos atualizados: ${videosAtualizados}`);
    console.log(`   📹 Total verificados: ${snapshot.size}`);
    console.log(`\n🚀 Agora teste o app - os vídeos devem aparecer e ser reproduzíveis!`);
    
  } catch (error) {
    console.error('❌ Erro ao adicionar URLs de vídeo:', error);
  } finally {
    process.exit(0);
  }
}

// Executar
addVideoUrlToExistingVideos();