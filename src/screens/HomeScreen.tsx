import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Play, User, Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useUser } from '../context/UserContext';
import Logo from '../components/Logo';

const { width, height } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user, logout } = useUser(); // Pegamos a função de logout também

  const handleNavigateToVideos = () => {
    // Esta função já está correta
    if (user.isLoggedIn) {
      navigation.navigate('ArenaList');
    } else {
      navigation.navigate('Login');
    }
  };

  // Função para o botão de perfil
  const handleProfilePress = () => {
    if (user.isLoggedIn) {
      // Se o usuário está logado, navega para a tela de perfil
      navigation.navigate('Profile');
    } else {
      // Se não está logado, vai para a tela de login
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header com Login */}
      <View style={styles.header}>
        <Logo size="large" color="light" />
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleProfilePress} // <-- Usamos a nova função aqui
        >
          <User size={16} color={user.isLoggedIn ? '#10B981' : 'white'} />
          <Text style={[styles.loginText, user.isLoggedIn && styles.loggedInText]}>
            {user.isLoggedIn ? user.name : 'Entrar'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            O Melhor do <Text style={styles.brandHighlight}>Futevôlei</Text>,
            Capturado para Você.
          </Text>
          <Text style={styles.welcomeDescription}>
            Encontre os replays das suas melhores jogadas em todas as arenas parceiras.
          </Text>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.mainActionButton}
            onPress={handleNavigateToVideos}
          >
            <Search size={24} color="white" />
            <Text style={styles.mainActionButtonText}>Encontrar meus Vídeos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Seus estilos (styles) continuam aqui...
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
        fontWeight: '500',
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
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    mainActionButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 12,
    },
});

export default HomeScreen;