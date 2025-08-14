import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  isLoggedIn: boolean;
}

interface UserContextType {
  user: User;
  login: (email: string, name: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>({
    email: '',
    name: '',
    isLoggedIn: false
  });

  const login = (email: string, name: string) => {
    setUser({
      email,
      name,
      isLoggedIn: true
    });
  };

  const logout = () => {
    setUser({
      email: '',
      name: '',
      isLoggedIn: false
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};