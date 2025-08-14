// src/services/firebase.ts
import { getApp } from '@react-native-firebase/app';
import firestore, { getFirestore } from '@react-native-firebase/firestore';
import storage, { getStorage } from '@react-native-firebase/storage';

// Para React Native Firebase, a configuração é automática
// através dos arquivos google-services.json (Android) e GoogleService-Info.plist (iOS)

// Usar a API moderna v22
const app = getApp();
const db = getFirestore(app);
const storageRef = getStorage(app);

export { db, storageRef as storage };