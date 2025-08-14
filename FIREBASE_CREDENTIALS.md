# 🔥 Como Encontrar suas Credenciais do Firebase

## 📋 **Onde Encontrar as Credenciais:**

1. **Acesse o Firebase Console:** https://console.firebase.google.com
2. **Selecione seu projeto:** sport-ftv (ou o nome que você deu)
3. **Clique no ícone de engrenagem** ⚙️ → "Configurações do projeto"
4. **Role para baixo** até "Seus apps"
5. **Clique em "Configuração"** do seu app web

## 🔧 **Substitua no arquivo `src/services/firebase.ts`:**

```typescript
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",                    // ← Cole sua API Key
  authDomain: "SEU_PROJECT_ID.firebaseapp.com", // ← Cole seu Auth Domain  
  projectId: "SEU_PROJECT_ID",                   // ← Cole seu Project ID
  storageBucket: "SEU_PROJECT_ID.appspot.com",  // ← Cole seu Storage Bucket
  messagingSenderId: "SEU_SENDER_ID",            // ← Cole seu Messaging Sender ID
  appId: "SUA_APP_ID",                          // ← Cole seu App ID
  measurementId: "SEU_MEASUREMENT_ID"            // ← Cole seu Measurement ID (opcional)
};
```

## 📝 **Exemplo de como fica:**

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnopqrstuvw",
  authDomain: "sport-ftv-12345.firebaseapp.com",
  projectId: "sport-ftv-12345", 
  storageBucket: "sport-ftv-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890123456",
  measurementId: "G-ABCDEF1234"
};
```

## ⚠️ **IMPORTANTE:**

- **NÃO compartilhe** essas credenciais publicamente
- Cada projeto tem credenciais únicas
- Se não tiver um app web configurado, clique em "Adicionar app" → Web

## 🚀 **Depois de atualizar:**

1. Salve o arquivo `firebase.ts`
2. Recarregue o app no emulador (R + R)
3. Teste o fluxo até a tela de vídeos

**Status:** Aguardando você atualizar as credenciais do Firebase! 🔥
