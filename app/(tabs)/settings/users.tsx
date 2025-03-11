import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { UserCard } from '@/components/UserCard';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type User = Database['public']['Tables']['users']['Row'];

export default function UsersScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('full_name');

      if (error) throw error;
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error('Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleUserPress = (user: User) => {
    router.push(`/settings/users/${user.id}`);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Cargando usuarios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Usuarios</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/settings/users/new')}
        >
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        renderItem={({ item }) => (
          <UserCard user={item} onPress={handleUserPress} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay usuarios registrados</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: Platform.select({ web: 'Inter_700Bold', default: 'Inter-Bold' }),
  },
  addButton: {
    backgroundColor: '#10b981',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  list: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontFamily: Platform.select({ web: 'Inter_500Medium', default: 'Inter-Medium' }),
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 16,
    fontFamily: Platform.select({ web: 'Inter_500Medium', default: 'Inter-Medium' }),
  },
  retryButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.select({ web: 'Inter_600SemiBold', default: 'Inter-SemiBold' }),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    fontFamily: Platform.select({ web: 'Inter_500Medium', default: 'Inter-Medium' }),
  },
});