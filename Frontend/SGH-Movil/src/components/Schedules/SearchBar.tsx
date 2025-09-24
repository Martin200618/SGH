import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/schedulesStyles';

interface Props {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Buscar...' }: Props) {
  return (
    <View style={styles.searchBarContainer}>
      <Ionicons name="search" size={20} color="#888" />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </View>
  );
}
