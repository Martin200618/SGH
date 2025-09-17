import React from 'react';
import { View, TextInput, Image } from 'react-native';
import { styles } from '../../styles/schedulesStyles';

export interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <View style={styles.searchBarContainer}>
      <Image
        source={require('../../assets/images/search.png')}
        style={{ width: 20, height: 20, tintColor: '#999' }}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar..."
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}
