import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Play, Camera, Trophy, Zap, ArrowRight, User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useUser } from '../context/UserContext';
import Logo from '../components/Logo';

const { width, height } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useUser();

  const handleNavigateToVideos = () => {
    if (user.isLoggedIn) {
      navigation.navigate('ArenaList');
    } else {
      navigation.navigate('Login');
    }
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };
  const features = [
    {
      icon: Play,
      title: 'Transmissões ao Vivo',
      description: 'Cobertura completa de torneios de futevôlei'
    },
    {
      icon: Camera,
      title: 'Câmeras Inteligentes',
      description: 'Sistema que captura os melhores momentos'
    },
    {
      icon: Trophy,
      title: 'Torneios Completos',
      description: 'Acompanhe resultados em tempo real'
    },
    {
      icon: Zap,
      title: 'Tecnologia Avançada',
      description: 'Inovação para melhorar sua experiência'
    }
  ];

  const stats = [
    { number: '12+', label: 'Torneios' },
    { number: '300+', label: 'Horas' },
    { number: '30K+', label: 'Espectadores' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header com Login */}
      <View style={styles.header}>
        <Logo size="large" color="light" />
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleNavigateToLogin}
        >
          <User size={16} color={user.isLoggedIn ? "#10B981" : "white"} />
          <Text style={[styles.loginText, user.isLoggedIn && styles.loggedInText]}>
            {user.isLoggedIn ? user.name || 'Logado' : 'Login'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            O Futuro das{'\n'}
            <Text style={styles.heroHighlight}>Transmissões</Text>{'\n'}
            de Futevôlei
          </Text>
          <Text style={styles.heroDescription}>
            Tecnologia de ponta para capturar cada momento histórico do esporte que amamos.
          </Text>
          
          {/* Botões Principais */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleNavigateToVideos}
            >
              <Play size={20} color="white" />
              <Text style={styles.primaryButtonText}>Ver Melhores Momentos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Nossa História</Text>
              <ArrowRight size={16} color="#1e3a8a" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Por que escolher a Sport FTV?</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Combinamos paixão pelo futevôlei com tecnologia de ponta
        </Text>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Icon size={24} color="white" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            );
          })}
        </View>
      </View>



      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Nossos Números</Text>
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>
          Pronto para Ver os Melhores Momentos?
        </Text>
        <Text style={styles.ctaDescription}>
          {user.isLoggedIn 
            ? 'Explore nossa biblioteca de vídeos incríveis' 
            : 'Faça login para acessar nosso conteúdo exclusivo'
          }
        </Text>
        <TouchableOpacity 
          style={styles.ctaButton} 
          onPress={user.isLoggedIn ? handleNavigateToVideos : handleNavigateToLogin}
        >
          <Text style={styles.ctaButtonText}>
            {user.isLoggedIn ? 'Explorar Vídeos' : 'Fazer Login'}
          </Text>
          <ArrowRight size={20} color="#1e3a8a" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1e3a8a',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loginText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 14,
  },
  loggedInText: {
    color: '#10B981',
  },
  heroSection: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 40,
    paddingHorizontal: 20,
    minHeight: height * 0.6,
    justifyContent: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  heroHighlight: {
    color: '#FCD34D',
  },
  heroDescription: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#FCD34D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#1e3a8a',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#1e3a8a',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresSection: {
    padding: 20,
    backgroundColor: 'white',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  brandHighlight: {
    color: '#1e3a8a',
  },
  sectionDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#1e3a8a',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  statsSection: {
    backgroundColor: '#1F2937',
    padding: 40,
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FCD34D',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  ctaSection: {
    backgroundColor: '#1e3a8a',
    margin: 20,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaDescription: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  ctaButtonText: {
    color: '#1e3a8a',
    fontSize: 16,
    fontWeight: '600',
  },

});

export default HomeScreen;
