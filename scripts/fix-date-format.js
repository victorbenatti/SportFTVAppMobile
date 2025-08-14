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

// Função para converter data DD/MM/YYYY para YYYY-MM-DD
function convertDateFormat(dateString) {
  if (!dateString) return null;
  
  // Se já está no formato correto (YYYY-MM-DD), retorna como está
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Se está no formato DD/MM/YYYY, converte
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Se está no formato DD/MM/YY, converte assumindo 20XX
  if (/^\d{2}\/\d{2}\/\d{2}$/.test(dateString)) {
    const [day, month, year] = dateString.split('/');
    const fullYear = parseInt(year) < 50 ? `20${year}` : `19${year}`;
    return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  console.warn(`Formato de data não reconhecido: ${dateString}`);
  return null;
}

// Função para converter hour string para number
function convertHourFormat(hourValue) {
  if (typeof hourValue === 'number') {
    return hourValue;
  }
  
  if (typeof hourValue === 'string') {
    const parsed = parseInt(hourValue);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  return 0;
}

async function fixDateFormats() {
  try {
    console.log('🔧 Iniciando correção de formatos de data...');
    
    const videosRef = db.collection('videos');
    const snapshot = await videosRef.get();
    
    console.log(`📊 Encontrados ${snapshot.size} vídeos para verificar`);
    
    let videosCorrigidos = 0;
    let videosComErro = 0;
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const updates = {};
      let needsUpdate = false;
      
      console.log(`\n📹 Verificando: ${data.title || 'Sem título'}`);
      console.log(`   ID: ${doc.id}`);
      
      // Verificar e corrigir campo date
      if (data.date) {
        const newDate = convertDateFormat(data.date);
        if (newDate && newDate !== data.date) {
          updates.date = newDate;
          needsUpdate = true;
          console.log(`   📅 Data: ${data.date} → ${newDate}`);
        } else if (newDate) {
          console.log(`   ✅ Data já está correta: ${data.date}`);
        } else {
          console.log(`   ❌ Erro ao converter data: ${data.date}`);
          videosComErro++;
          continue;
        }
      } else {
        // Se não tem data, adiciona data atual
        updates.date = new Date().toISOString().split('T')[0];
        needsUpdate = true;
        console.log(`   📅 Adicionando data atual: ${updates.date}`);
      }
      
      // Verificar e corrigir campo hour
      if (data.hour !== undefined) {
        const newHour = convertHourFormat(data.hour);
        if (newHour !== data.hour) {
          updates.hour = newHour;
          needsUpdate = true;
          console.log(`   🕐 Hora: ${data.hour} → ${newHour}`);
        } else {
          console.log(`   ✅ Hora já está correta: ${data.hour}`);
        }
      } else {
        // Se não tem hora, adiciona hora padrão
        updates.hour = 18;
        needsUpdate = true;
        console.log(`   🕐 Adicionando hora padrão: 18`);
      }
      
      // Verificar campos essenciais
      if (!data.arenaId) {
        updates.arenaId = 'arena_sport_center';
        needsUpdate = true;
        console.log(`   🏟️ Adicionando arenaId padrão: arena_sport_center`);
      }
      
      if (!data.quadraId) {
        updates.quadraId = 'quadra_1';
        needsUpdate = true;
        console.log(`   🎾 Adicionando quadraId padrão: quadra_1`);
      }
      
      // Aplicar atualizações se necessário
      if (needsUpdate) {
        try {
          await doc.ref.update(updates);
          videosCorrigidos++;
          console.log(`   ✅ Vídeo atualizado com sucesso!`);
        } catch (error) {
          console.error(`   ❌ Erro ao atualizar vídeo:`, error);
          videosComErro++;
        }
      } else {
        console.log(`   ✅ Vídeo já está correto`);
      }
    }
    
    console.log(`\n🎉 Processo concluído!`);
    console.log(`📊 Estatísticas:`);
    console.log(`   ✅ Vídeos corrigidos: ${videosCorrigidos}`);
    console.log(`   ❌ Vídeos com erro: ${videosComErro}`);
    console.log(`   📹 Total verificados: ${snapshot.size}`);
    console.log(`\n🚀 Agora teste o app para ver se os vídeos aparecem!`);
    
  } catch (error) {
    console.error('❌ Erro ao corrigir formatos:', error);
  } finally {
    process.exit(0);
  }
}

// Executar correção
fixDateFormats();