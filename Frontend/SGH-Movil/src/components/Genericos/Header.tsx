import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/landingStyles';

type HeaderProps = {
  title: string;
  buttonLabel: string;
  onPress: () => void;
};

export default function Header({ title, buttonLabel, onPress }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity style={styles.headerButton} onPress={onPress}>
        <Text style={styles.headerButtonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}
