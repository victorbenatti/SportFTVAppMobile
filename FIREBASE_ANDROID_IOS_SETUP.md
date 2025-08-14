# 🔥 **Firebase para Android & iOS - Guia Completo**

## 📱 **PARTE 1: CONFIGURAR ANDROID**

### **1.1 Adicionar App Android no Firebase Console**

1. **Acesse:** https://console.firebase.google.com
2. **Selecione seu projeto:** sport-ftv
3. **Clique em** "Adicionar app" → 📱 **Android**
4. **Preencha os dados:**
   ```
   Nome do pacote Android: com.sportftvapp
   Apelido do app: Sport FTV Android
   Certificado de assinatura SHA-1: (deixe vazio por enquanto)
   ```
5. **Clique em** "Registrar app"

### **1.2 Baixar google-services.json**

1. **Baixe o arquivo** `google-services.json`
2. **Mova para:** `c:\Users\ACER_NITRO\Desktop\SportFTVApp\android\app\`
   ```
   SportFTVApp/
   └── android/
       └── app/
           └── google-services.json  ← Aqui!
   ```

### **1.3 Configurar build.gradle (Project)**

**Arquivo:** `android/build.gradle`
```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.4.0'  // ← Adicionar esta linha
        // ... outras dependências
    }
}
```

### **1.4 Configurar build.gradle (App)**

**Arquivo:** `android/app/build.gradle`
```gradle
// No topo do arquivo, adicione:
apply plugin: 'com.google.gms.google-services'  // ← Adicionar esta linha

android {
    // ... configurações existentes
}

dependencies {
    // Adicionar estas dependências:
    implementation 'com.google.firebase:firebase-bom:32.7.0'
    implementation 'com.google.firebase:firebase-firestore'
    implementation 'com.google.firebase:firebase-storage'
    implementation 'com.google.firebase:firebase-analytics'
    // ... outras dependências existentes
}
```

---

## 🍎 **PARTE 2: CONFIGURAR iOS**

### **2.1 Adicionar App iOS no Firebase Console**

1. **No mesmo projeto Firebase**
2. **Clique em** "Adicionar app" → 🍎 **iOS**
3. **Preencha os dados:**
   ```
   ID do pacote iOS: com.sportftvapp
   Apelido do app: Sport FTV iOS
   ID da App Store: (deixe vazio)
   ```
4. **Clique em** "Registrar app"

### **2.2 Baixar GoogleService-Info.plist**

1. **Baixe o arquivo** `GoogleService-Info.plist`
2. **Mova para:** `c:\Users\ACER_NITRO\Desktop\SportFTVApp\ios\SportFTVApp\`
   ```
   SportFTVApp/
   └── ios/
       └── SportFTVApp/
           └── GoogleService-Info.plist  ← Aqui!
   ```

### **2.3 Configurar Podfile**

**Arquivo:** `ios/Podfile`
```ruby
# Adicionar no topo:
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

platform :ios, '12.4'
install! 'cocoapods', :deterministic_uuids => false

target 'SportFTVApp' do
  config = use_native_modules!

  # Adicionar estas linhas:
  pod 'Firebase', :modular_headers => true
  pod 'FirebaseCoreInternal', :modular_headers => true
  pod 'GoogleUtilities', :modular_headers => true
  pod 'FirebaseCore', :modular_headers => true
  pod 'FirebaseFirestore', :modular_headers => true
  pod 'FirebaseStorage', :modular_headers => true

  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => false
  )

  target 'SportFTVAppTests' do
    inherit! :complete
  end

  post_install do |installer|
    react_native_post_install(installer)
  end
end
```

---

## 🚀 **PARTE 3: INSTALAR DEPENDÊNCIAS**

### **3.1 Instalar Pacotes React Native**
```bash
npm install @react-native-firebase/app @react-native-firebase/firestore @react-native-firebase/storage
```

### **3.2 Para iOS - Instalar Pods**
```bash
cd ios && pod install && cd ..
```

---

## ⚙️ **PARTE 4: ATUALIZAR CÓDIGO**

### **4.1 Atualizar firebase.ts**

**Arquivo:** `src/services/firebase.ts`
```typescript
import { initializeApp } from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Para React Native Firebase, a configuração é automática
// através dos arquivos google-services.json e GoogleService-Info.plist

const db = firestore();
const storageRef = storage();

export { db, storageRef as storage };
```

---

## 📋 **CHECKLIST FINAL**

### ✅ **Android:**
- [ ] App Android criado no Firebase Console
- [ ] `google-services.json` baixado e colocado em `android/app/`
- [ ] `android/build.gradle` atualizado
- [ ] `android/app/build.gradle` atualizado
- [ ] Dependências npm instaladas

### ✅ **iOS:**
- [ ] App iOS criado no Firebase Console  
- [ ] `GoogleService-Info.plist` baixado e colocado em `ios/SportFTVApp/`
- [ ] `ios/Podfile` atualizado
- [ ] Pods instalados (`pod install`)

### ✅ **Código:**
- [ ] `firebase.ts` atualizado para usar React Native Firebase
- [ ] App testado no Android
- [ ] App testado no iOS

---

## 🔧 **COMANDOS PARA TESTAR**

```bash
# Android
npx react-native run-android

# iOS (só funciona no macOS)
npx react-native run-ios
```

**🎯 Siga os passos na ordem e teste após cada etapa!**
