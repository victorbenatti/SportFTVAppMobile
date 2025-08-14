# Configuração do Firebase para Sport FTV App

Este documento explica como configurar o Firebase e popular o banco de dados com dados de exemplo.

## 1. Configuração do Firebase

### 1.1 Criar Projeto no Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto"
3. Nomeie o projeto (ex: "sport-ftv-app")
4. Configure o Google Analytics (opcional)

### 1.2 Configurar Firestore
1. No console do Firebase, vá para "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Selecione uma localização próxima

### 1.3 Configurar Authentication (se necessário)
1. Vá para "Authentication" > "Sign-in method"
2. Ative os provedores desejados (Email/Password, Google, etc.)

### 1.4 Configurar o App React Native
1. No console do Firebase, clique em "Adicionar app" > "Android" ou "iOS"
2. Siga as instruções para baixar os arquivos de configuração:
   - Android: `google-services.json` (colocar em `android/app/`)
   - iOS: `GoogleService-Info.plist` (colocar em `ios/`)

## 2. Estrutura do Banco de Dados

### 2.1 Coleção: `videos`
Cada documento de vídeo deve ter os seguintes campos:

```javascript
{
  title: string,           // Título do vídeo
  description: string,     // Descrição do vídeo
  videoUrl: string,        // URL do arquivo de vídeo
  thumbnailUrl: string,    // URL da thumbnail
  duration: string,        // Duração no formato "MM:SS"
  date: string,           // Data no formato "YYYY-MM-DD"
  tournament: string,      // Nome do torneio/evento
  views: number,          // Número de visualizações
  arenaId: string,        // ID da arena (ex: "arena1", "arena2")
  quadraId: string,       // ID da quadra (ex: "quadra1", "quadra2", "quadra3", "quadra4")
  hour: number,           // Hora do vídeo (0-23)
  timestamp: string,      // Timestamp ISO do vídeo
  createdAt: Timestamp,   // Data de criação (automático)
  updatedAt: Timestamp    // Data de atualização (automático)
}
```

### 2.2 Coleção: `arenas` (opcional - futura implementação)
```javascript
{
  name: string,           // Nome da arena
  address: string,        // Endereço da arena
  description: string,    // Descrição da arena
  totalQuadras: number,   // Número total de quadras
  status: string          // "active" ou "inactive"
}
```

### 2.3 Coleção: `quadras` (opcional - futura implementação)
```javascript
{
  name: string,           // Nome da quadra
  arenaId: string,        // ID da arena pai
  description: string,    // Descrição da quadra
  status: string,         // "active" ou "inactive"
  cameraType: string      // Tipo de câmera
}
```

## 3. Populando o Banco com Dados de Exemplo

### 3.1 Usando o Script Automático

1. **Instalar Firebase Admin SDK:**
```bash
npm install firebase-admin
```

2. **Configurar credenciais:**
   - No console do Firebase, vá para "Configurações do projeto" > "Contas de serviço"
   - Clique em "Gerar nova chave privada"
   - Salve o arquivo JSON em `scripts/serviceAccountKey.json`

3. **Editar o script:**
   - Abra `scripts/populate-firestore.js`
   - Descomente as linhas de inicialização do Firebase
   - Ajuste o caminho para o arquivo de credenciais
   - Configure a URL do banco de dados

4. **Executar o script:**
```bash
node scripts/populate-firestore.js
```

### 3.2 Adicionando Dados Manualmente

Você pode usar as funções helper do app para adicionar vídeos:

```javascript
import { addVideoToFirestore } from '../utils/firestore-helpers';

const videoData = {
  title: 'Meu Vídeo',
  videoUrl: 'https://example.com/video.mp4',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  duration: '2:30',
  date: '2024-01-20',
  tournament: 'Campeonato Local',
  views: 100,
  arenaId: 'arena1',
  quadraId: 'quadra1',
  hour: 18,
  description: 'Descrição do vídeo'
};

addVideoToFirestore(videoData);
```

## 4. Regras de Segurança do Firestore

Para desenvolvimento, você pode usar regras básicas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura para todos
    match /videos/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /arenas/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /quadras/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**⚠️ IMPORTANTE:** Para produção, implemente regras de segurança mais restritivas!

## 5. Testando a Integração

1. **Verificar conexão:**
   - Execute o app
   - Verifique se não há erros de conexão no console
   - Teste a navegação entre telas

2. **Verificar dados:**
   - Navegue para a tela inicial
   - Verifique se os vídeos recentes aparecem
   - Teste os filtros por arena, quadra e data

3. **Verificar funcionalidades:**
   - Teste a busca de vídeos
   - Verifique os contadores de vídeos por quadra
   - Teste a navegação entre diferentes seções

## 6. Troubleshooting

### Erro: "Default FirebaseApp is not initialized"
- Verifique se os arquivos de configuração estão nos locais corretos
- Certifique-se de que o Firebase foi inicializado corretamente

### Erro: "Permission denied"
- Verifique as regras de segurança do Firestore
- Para desenvolvimento, use regras permissivas

### Vídeos não aparecem
- Verifique se os dados foram inseridos corretamente
- Confirme se os campos obrigatórios estão preenchidos
- Verifique os filtros aplicados nas queries

### Performance lenta
- Considere adicionar índices compostos no Firestore
- Limite o número de documentos retornados nas queries
- Use paginação para listas grandes

## 7. Próximos Passos

1. **Implementar upload de vídeos:**
   - Configurar Firebase Storage
   - Criar interface para upload
   - Implementar processamento de thumbnails

2. **Adicionar autenticação:**
   - Implementar login/registro
   - Controlar acesso baseado em usuário
   - Adicionar perfis de usuário

3. **Melhorar performance:**
   - Implementar cache local
   - Adicionar paginação
   - Otimizar queries

4. **Adicionar funcionalidades:**
   - Sistema de favoritos
   - Comentários em vídeos
   - Compartilhamento
   - Notificações push