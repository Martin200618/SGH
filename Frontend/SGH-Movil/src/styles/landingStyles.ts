import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  headerButton: { backgroundColor: '#007BFF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5 },
  headerButtonText: { color: '#fff', fontWeight: 'bold' },

  // Logo
  logo: { width: 150, height: 150, alignSelf: 'center', marginBottom: 20, resizeMode: 'contain' },

  // InfoCard
  infoCard: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 20 },
  infoText: { fontSize: 14, marginBottom: 5 },

  // Stats
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { alignItems: 'center', flex: 1, marginHorizontal: 5, backgroundColor: '#f1f1f1', padding: 10, borderRadius: 10 },
  statIcon: { width: 40, height: 40, marginBottom: 5, resizeMode: 'contain' },
  statNumber: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 12, textAlign: 'center' },
});
