# 🚀 **AÇÃO NECESSÁRIA: Configurar App Android no Firebase**

## **📱 Passo 1: Firebase Console (5 minutos)**

### **1. Abra o Firebase Console:**
🌐 **https://console.firebase.google.com**

### **2. Selecione seu projeto Sport FTV**

### **3. Adicionar App Android:**
- Clique no botão **"Adicionar app"** (ícone +)
- Selecione **📱 Android**

### **4. Preencher dados do app:**
```
Nome do pacote Android: com.sportftvapp
Apelido do app (opcional): Sport FTV Android  
Certificado SHA-1: (deixe vazio por enquanto)
```

### **5. Clique em "Registrar app"**

### **6. BAIXAR google-services.json:**
- **BAIXE** o arquivo `google-services.json`
- **MOVA** para: `c:\Users\ACER_NITRO\Desktop\SportFTVApp\android\app\google-services.json`

**⚠️ IMPORTANTE:** O arquivo deve ficar exatamente nesta pasta:
```
SportFTVApp/
└── android/
    └── app/
        └── google-services.json  ← AQUI!
```

---

## **🔧 O que já foi configurado:**

✅ **Dependências instaladas:** React Native Firebase  
✅ **Arquivos Android atualizados:** build.gradle files  
✅ **Código atualizado:** firebase.ts para React Native Firebase  
✅ **Tela de vídeos atualizada:** Para usar nova API

---

## **🎯 Próximos passos após baixar o arquivo:**

1. **Colocar google-services.json** na pasta correta
2. **Testar o app:** `npx react-native run-android`
3. **Verificar se Firebase conecta** (tela de vídeos)

---

## **🍎 Depois: Configurar iOS**

Mesmo processo, mas para iOS:
- Adicionar app iOS no Firebase
- Baixar `GoogleService-Info.plist`
- Colocar em `ios/SportFTVApp/`

**📲 Faça o download do google-services.json agora e me avise quando estiver pronto!**
