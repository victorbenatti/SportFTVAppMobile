import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { UserProvider } from './src/context/UserContext';

function App(): React.JSX.Element {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}

export default App;