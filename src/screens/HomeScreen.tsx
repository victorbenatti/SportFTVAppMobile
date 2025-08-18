import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Play, User, Search } from 'lucide-react-native';
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
  return (
    <View style={styles.container}>
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

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Bem-vindo ao{'\n'}
            <Text style={styles.brandHighlight}>Sport FTV</Text>
          </Text>
          <Text style={styles.welcomeDescription}>
            Encontre e assista aos melhores momentos do futevôlei
          </Text>
        </View>

        {/* Action Button */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.mainActionButton} 
            onPress={handleNavigateToVideos}
          >
            <Search size={24} color="white" />
            <Text style={styles.mainActionText}>
              {user.isLoggedIn ? 'Buscar Vídeos por Arena' : 'Fazer Login para Continuar'}
            </Text>
          </TouchableOpacity>
          
          {user.isLoggedIn && (
            <Text style={styles.helpText}>
              Selecione uma arena para ver os vídeos disponíveis
            </Text>
          )}
        </View>
      </View>
    </View>
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
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  brandHighlight: {
    color: '#1e3a8a',
  },
  welcomeDescription: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
  },
  actionSection: {
    alignItems: 'center',
  },
  mainActionButton: {
    backgroundColor: '#1e3a8a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 12,
    width: '100%',
    shadowColor: '#1e3a8a',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainActionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
});

export default HomeScreen;
