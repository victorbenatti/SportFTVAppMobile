# 📋 Campos Necessários no Firestore

## 🔴 **URGENTE - Campos que estão FALTANDO no Firestore:**

Para que o app funcione corretamente com filtros, você precisa adicionar estes campos em cada documento da coleção `videos`:

### **Campos Obrigatórios para Adicionar:**

```javascript
{
  // Campos que já existem ✅
  "date": "03/08/2025",
  "description": "teste", 
  "duration": "00:05",
  "thumbnailUrl": "",
  "title": "Replay 1",
  "tournament": "Serrano Cup 14° edição",
  "videoUrl": "https://firebasestorage...",
  "views": "0",

  // Campos NOVOS que precisam ser adicionados ❌
  "arenaId": "arena_sport_center",        // ID da arena
  "quadraId": "quadra_1",                 // ID da quadra/câmera
  "hour": 14,                             // Hora que foi gravado (14 = 14h)
  "timestamp": "2025-08-03T14:30:00Z"     // Timestamp completo para ordenação
}
```

### **Exemplo de como adicionar os campos:**

1. **arenaId**: Use IDs consistentes como:
   - `"arena_sport_center"`
   - `"arena_beach_club"`
   - `"arena_futevolei_praia"`

2. **quadraId**: Use IDs como:
   - `"quadra_1"`
   - `"quadra_2"`
   - `"quadra_3"`

3. **hour**: Número inteiro de 0-23:
   - `14` para 14h (2pm)
   - `18` para 18h (6pm)

4. **timestamp**: Data/hora completa em ISO:
   - `"2025-08-03T14:30:00Z"`

### **⚠️ Campos que podem ser melhorados:**

- **views**: Alterar de string para number: `0` ao invés de `"0"`
- **date**: Padronizar formato para ISO: `"2025-08-03"` ao invés de `"03/08/2025"`

### **🚀 Como fazer no Firestore Console:**

1. Acesse seu projeto no Firebase Console
2. Vá em Firestore Database
3. Para cada documento em `videos`, clique em "Editar"
4. Adicione os campos novos:
   - Clique em "Adicionar campo"
   - Digite o nome do campo
   - Escolha o tipo (string, number, etc.)
   - Digite o valor

### **📝 Exemplo de documento completo:**

```javascript
{
  "arenaId": "arena_sport_center",
  "date": "2025-08-03",
  "description": "Lance incrível do Serrano Cup",
  "duration": "00:30",
  "hour": 14,
  "quadraId": "quadra_1", 
  "thumbnailUrl": "https://...",
  "timestamp": "2025-08-03T14:30:00Z",
  "title": "Gol Espetacular - Semifinal",
  "tournament": "Serrano Cup 14° edição",
  "videoUrl": "https://firebasestorage...",
  "views": 0
}
```

Após adicionar esses campos, o app conseguirá filtrar corretamente os vídeos por:
- Arena selecionada
- Data escolhida  
- Quadra/câmera específica
- Horário exato

**🔧 Status atual:** O app está buscando todos os vídeos do Firebase, mas não consegue filtrar porque os campos de filtro não existem ainda.
