import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/landingStyles';

type InfoCardProps = {
  items: string[];
};

export default function InfoCard({ items }: InfoCardProps) {
  return (
    <View style={styles.infoCard}>
      {items.map((item, index) => (
        <Text key={index} style={styles.infoText}>{item}</Text>
      ))}
    </View>
  );
}
