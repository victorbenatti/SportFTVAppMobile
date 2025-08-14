# 📋 Campos Obrigatórios para Criar Vídeo de Teste

## 🎯 **Campos que você DEVE adicionar no Firebase:**

```javascript
{
  // CAMPOS OBRIGATÓRIOS para filtros funcionarem
  "arenaId": "arena_sport_center",           // ID da arena (string)
  "quadraId": "quadra_1",                    // ID da quadra (string)
  "hour": 16,                                // Hora do vídeo (number 0-23)
  "timestamp": "2025-08-07T16:30:00Z",       // Data/hora completa (string ISO)
  
  // CAMPOS BÁSICOS do vídeo
  "title": "Teste - Gol Incrível",           // Título do vídeo (string)
  "description": "Vídeo de teste com todos os campos", // Descrição (string)
  "videoUrl": "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", // URL do vídeo (string)
  "thumbnailUrl": "https://via.placeholder.com/300x200/e74c3c/ffffff?text=Teste", // URL da thumbnail (string)
  "duration": "1:30",                        // Duração MM:SS (string)
  "date": "2025-08-07",                      // Data YYYY-MM-DD (string)
  "tournament": "Teste Serrano Cup",         // Nome do torneio (string)
  "views": 0                                 // Visualizações (number)
}
```

## 🔧 **Como criar no Firebase Console:**

1. **Acesse:** https://console.firebase.google.com
2. **Vá para:** Firestore Database → Coleção `videos`
3. **Clique em:** "Adicionar documento"
4. **ID do documento:** Deixe automático ou digite `video_teste_001`
5. **Adicione cada campo:**

### **Campos obrigatórios (um por um):**

| Campo | Tipo | Valor Sugerido |
|-------|------|----------------|
| `arenaId` | string | `arena_sport_center` |
| `quadraId` | string | `quadra_1` |
| `hour` | number | `16` |
| `timestamp` | string | `2025-08-07T16:30:00Z` |
| `title` | string | `Teste - Gol Incrível` |
| `description` | string | `Vídeo de teste com todos os campos` |
| `videoUrl` | string | `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4` |
| `thumbnailUrl` | string | `https://via.placeholder.com/300x200/e74c3c/ffffff?text=Teste` |
| `duration` | string | `1:30` |
| `date` | string | `2025-08-07` |
| `tournament` | string | `Teste Serrano Cup` |
| `views` | number | `0` |

## 🎯 **Valores para testar filtros:**

### **Para Arena:**
- `arenaId`: `"arena_sport_center"` ou `"arena_beach_club"`

### **Para Quadra:**
- `quadraId`: `"quadra_1"`, `"quadra_2"`, `"quadra_3"` ou `"quadra_4"`

### **Para Data:**
- `date`: `"2025-08-07"` (formato YYYY-MM-DD)
- `timestamp`: `"2025-08-07T16:30:00Z"` (mesmo dia)

### **Para Horário:**
- `hour`: `16` (para 16h), `18` (para 18h), `20` (para 20h)

## ✅ **STATUS DOS FILTROS:**

### **🟡 PARCIALMENTE FUNCIONANDO:**
- ✅ **Código corrigido:** Queries não quebram mais
- ✅ **Tratamento de erro:** App funciona mesmo sem campos
- ❌ **Filtros ativos:** Só funcionarão após adicionar os campos

### **🚀 APÓS CRIAR O VÍDEO DE TESTE:**
1. **Filtros funcionarão 100%**
2. **App mostrará o vídeo na tela correta**
3. **Busca por arena/quadra/data/hora funcionará**

## 🧪 **TESTE COMPLETO:**

Após criar o vídeo:
1. **Abra o app**
2. **Navegue:** Home → Login → Arena → Data → Quadra → Hora
3. **Selecione:**
   - Arena: "Sport Center" (se arenaId = "arena_sport_center")
   - Data: "07/08/2025" (se date = "2025-08-07")
   - Quadra: "Quadra 1" (se quadraId = "quadra_1")
   - Hora: "16h" (se hour = 16)
4. **Resultado:** Deve aparecer seu vídeo "Teste - Gol Incrível"

## 📝 **RESUMO:**
- **12 campos obrigatórios** para funcionar 100%
- **4 campos críticos** para filtros: `arenaId`, `quadraId`, `hour`, `timestamp`
- **Filtros funcionarão** assim que você criar o vídeo com esses campos

**🎯 Crie o vídeo de teste e me confirme quando estiver pronto para testar!**