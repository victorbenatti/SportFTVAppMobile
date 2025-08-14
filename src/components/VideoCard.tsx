import React from 'react';
// Importamos os componentes do React Native em vez de tags HTML
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { Play, Clock, Calendar, Download } from 'lucide-react-native'; // Usamos a versão nativa do Lucide

// A interface é exatamente a mesma!
interface VideoCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  date: string;
  onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ title, thumbnail, videoUrl, duration, date, onClick }) => {

  const handleDownload = (e: any) => {
    // No mobile, o "download" geralmente significa abrir o link em um navegador,
    // onde o usuário pode salvar. Bibliotecas mais avançadas podem salvar direto no dispositivo.
    e.stopPropagation();
    Alert.alert(
      "Download do Vídeo",
      `Deseja abrir o vídeo "${title}" no navegador?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Abrir", onPress: () => Linking.openURL(videoUrl) }
      ]
    );
  };

  const handlePlayVideo = () => {
    Alert.alert(
      "Reproduzir Vídeo",
      `Reproduzindo: "${title}"`,
      [
        { text: "OK", onPress: onClick }
      ]
    );
  };

  return (
    // TouchableOpacity é como um <div> clicável. É o nosso container principal.
    <TouchableOpacity style={styles.card} onPress={handlePlayVideo}>
      {/* View é o equivalente a <div> */}
      <View style={styles.thumbnailContainer}>
        {/* Image precisa de uma URI no `source` */}
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
        <View style={styles.overlay} />
        <TouchableOpacity style={styles.playButtonContainer} onPress={handlePlayVideo}>
          <View style={styles.playButton}>
            <Play color="#1e40af" size={24} fill="#1e40af" />
          </View>
        </TouchableOpacity>
        <View style={styles.durationContainer}>
          <Clock size={12} color="white" />
          <Text style={styles.durationText}>{duration}</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.metadataContainer}>
          <View style={styles.metadataItem}>
            <Calendar size={12} color="#6B7280" />
            <Text style={styles.metadataText}>{date}</Text>
          </View>
          {/* Botão de Download */}
          <TouchableOpacity onPress={handleDownload} style={styles.downloadButton}>
            <Download size={16} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// A estilização é feita com JavaScript Objects, não CSS.
// As propriedades são muito parecidas com CSS (ex: backgroundColor, fontSize).
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    aspectRatio: 16 / 9,
    width: '100%',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  playButtonContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  metadataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  downloadButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoCard;