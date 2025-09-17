import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from '../../styles/schedulesStyles';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function Pagination({ page, totalPages, onPrev, onNext }: PaginationProps) {
  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[styles.paginationButton, page === 0 && styles.paginationButtonDisabled]}
        onPress={onPrev}
        disabled={page === 0}
      >
        <Text style={styles.paginationText}>Anterior</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.paginationButton, page === totalPages - 1 && styles.paginationButtonDisabled]}
        onPress={onNext}
        disabled={page === totalPages - 1}
      >
        <Text style={styles.paginationText}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
}
