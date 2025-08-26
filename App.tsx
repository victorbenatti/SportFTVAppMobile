import React, {useEffect} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { UserProvider } from './src/context/UserContext';
import RNBootSplash from 'react-native-bootsplash';

const App = () => {
  useEffect(() => {
    // Esconde a splash screen quando o componente App é montado
    RNBootSplash.hide({ fade: true }); 
  }, []);

  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
};

export default App;