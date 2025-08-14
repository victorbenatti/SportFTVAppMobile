import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BestMomentsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sport FTV</Text>
      <Text style={styles.subtitle}>Melhores Momentos</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default BestMomentsScreen;
