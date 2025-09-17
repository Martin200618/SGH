import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E3A59',
  },
  searchBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  listContainer: {
    flex: 1,
  },
  courseItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  courseText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E3A59',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: '#2E3A59',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  paginationButton: {
    backgroundColor: '#2E3A59',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  paginationButtonDisabled: {
    backgroundColor: '#7A8BA3',
    opacity: 0.6,
  },
  paginationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
