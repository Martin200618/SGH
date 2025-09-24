import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/schedulesStyles';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[
          styles.paginationButton,
          currentPage === 0 && styles.paginationButtonDisabled,
        ]}
        disabled={currentPage === 0}
        onPress={() => onPageChange(currentPage - 1)}
        activeOpacity={0.8}
      >
        <Text style={styles.paginationText}>Anterior</Text>
      </TouchableOpacity>

      <Text style={styles.paginationText}>
        {currentPage + 1} / {totalPages || 1}
      </Text>

      <TouchableOpacity
        style={[
          styles.paginationButton,
          currentPage >= totalPages - 1 && styles.paginationButtonDisabled,
        ]}
        disabled={currentPage >= totalPages - 1}
        onPress={() => onPageChange(currentPage + 1)}
        activeOpacity={0.8}
      >
        <Text style={styles.paginationText}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
}
