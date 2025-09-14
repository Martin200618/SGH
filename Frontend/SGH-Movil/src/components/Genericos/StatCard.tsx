import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import { styles } from '../../styles/landingStyles';

type StatCardProps = {
  number: string;
  label: string;
  icon: ImageSourcePropType;
};

export default function StatCard({ number, label, icon }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Image source={icon} style={styles.statIcon} />
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}
