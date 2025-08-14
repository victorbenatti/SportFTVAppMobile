# 🔥 CORREÇÃO URGENTE - Campos do Firebase

## 🚨 **PROBLEMA IDENTIFICADO:**

Você tem um vídeo no Firebase com estes campos:
```
createdAt: 7 de agosto de 2025 às 16:27:44 UTC-3
date: "03/08/2025"
description: "Descrição não informada"
duration: "0:00"
thumbnailUrl: ""
title: "replay 4"
tournament: "serrano"
updatedAt: 7 de agosto de 2025 às 16:27:44 UTC-3
videoUrl: "https://firebasestorage.googleapis.com/v0/b/sport-ftv..."
views: "0"
```

**❌ CAMPOS QUE ESTÃO FALTANDO:**
- `arenaId` (obrigatório para filtros)
- `quadraId` (obrigatório para filtros)
- `hour` (obrigatório para filtros)
- `timestamp` (obrigatório para ordenação)

## 🛠️ **SOLUÇÃO RÁPIDA:**

### **1. Acesse o Firebase Console:**
- Vá para: https://console.firebase.google.com
- Selecione seu projeto
- Clique em "Firestore Database"
- Encontre a coleção `videos`
- Clique no documento que você mostrou

### **2. Adicione os campos que estão faltando:**

Para o documento "replay 4", clique em **"Editar"** e adicione:

```
arenaId: "arena_sport_center"     (tipo: string)
quadraId: "quadra_1"              (tipo: string)
hour: 16                          (tipo: number)
timestamp: "2025-08-03T16:27:44Z" (tipo: string)
```

### **3. Passos detalhados no Firebase Console:**

1. **Clique no documento** (o que tem title "replay 4")
2. **Clique em "Editar"** (ícone de lápis)
3. **Para cada campo novo:**
   - Clique em "+ Adicionar campo"
   - Digite o nome do campo
   - Selecione o tipo (string ou number)
   - Digite o valor
   - Clique em "Atualizar"

### **4. Valores sugeridos para seus campos:**

**arenaId:** Use um ID consistente como:
- `"arena_sport_center"`
- `"arena_beach_club"`
- `"arena_futevolei_praia"`

**quadraId:** Use IDs como:
- `"quadra_1"` (para câmera 1)
- `"quadra_2"` (para câmera 2)
- `"quadra_3"` (para câmera 3)

**hour:** Baseado no horário que foi gravado:
- `16` (para 16h/4pm)
- `18` (para 18h/6pm)
- `20` (para 20h/8pm)

**timestamp:** Converta a data/hora para ISO:
- `"2025-08-03T16:27:44Z"` (baseado no seu createdAt)

### **5. Exemplo do documento corrigido:**

```javascript
{
  "arenaId": "arena_sport_center",
  "createdAt": "7 de agosto de 2025 às 16:27:44 UTC-3",
  "date": "2025-08-03",  // ← Também mude para formato ISO
  "description": "Lance incrível do replay 4",
  "duration": "0:30",
  "hour": 16,
  "quadraId": "quadra_1",
  "thumbnailUrl": "",
  "timestamp": "2025-08-03T16:27:44Z",
  "title": "replay 4",
  "tournament": "serrano",
  "updatedAt": "7 de agosto de 2025 às 16:27:44 UTC-3",
  "videoUrl": "https://firebasestorage.googleapis.com/v0/b/sport-ftv...",
  "views": 0  // ← Mude de string "0" para number 0
}
```

## 🎯 **TESTE APÓS CORREÇÃO:**

1. **Salve as alterações** no Firebase Console
2. **Recarregue o app** no emulador (R + R)
3. **Teste o fluxo:**
   - Home → Login → Arena → Data → Quadra → Hora
   - Na tela de vídeos, deve aparecer seu vídeo "replay 4"

## 📋 **CHECKLIST:**

- [ ] Adicionei `arenaId` (string)
- [ ] Adicionei `quadraId` (string)
- [ ] Adicionei `hour` (number)
- [ ] Adicionei `timestamp` (string)
- [ ] Mudei `date` para formato ISO (opcional)
- [ ] Mudei `views` para number (opcional)
- [ ] Testei o app após as mudanças

## 🚀 **RESULTADO ESPERADO:**

Após adicionar esses campos, o app conseguirá:
- ✅ Filtrar vídeos por arena
- ✅ Filtrar vídeos por quadra
- ✅ Filtrar vídeos por data
- ✅ Filtrar vídeos por horário
- ✅ Exibir o vídeo "replay 4" na tela correta

**Status:** Aguardando você adicionar os campos no Firebase Console! 🔥