import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Database } from '@/types/supabase';

type User = Database['public']['Tables']['users']['Row'];

interface UserCardProps {
  user: User;
  onPress: (user: User) => void;
}

const getRoleColor = (role: User['role']) => {
  switch (role) {
    case 'admin':
      return '#ef4444';
    case 'waiter':
      return '#3b82f6';
    case 'cook':
      return '#f59e0b';
    case 'cashier':
      return '#10b981';
    default:
      return '#6b7280';
  }
};

const getRoleText = (role: User['role']) => {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'waiter':
      return 'Mesero';
    case 'cook':
      return 'Cocinero';
    case 'cashier':
      return 'Cajero';
    default:
      return role;
  }
};

export function UserCard({ user, onPress }: UserCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(user)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{user.full_name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) }]}>
          <Text style={styles.roleText}>{getRoleText(user.role)}</Text>
        </View>
      </View>

      {user.zone_id && (
        <View style={styles.zoneContainer}>
          <Text style={styles.zoneLabel}>Zona asignada:</Text>
          <Text style={styles.zoneText}>{user.zone_id}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: Platform.select({ web: 'Inter_600SemiBold', default: 'Inter-SemiBold' }),
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
    fontFamily: Platform.select({ web: 'Inter_400Regular', default: 'Inter-Regular' }),
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Platform.select({ web: 'Inter_500Medium', default: 'Inter-Medium' }),
  },
  zoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  zoneLabel: {
    fontSize: 14,
    color: '#4b5563',
    fontFamily: Platform.select({ web: 'Inter_500Medium', default: 'Inter-Medium' }),
  },
  zoneText: {
    fontSize: 14,
    color: '#111827',
    fontFamily: Platform.select({ web: 'Inter_400Regular', default: 'Inter-Regular' }),
  },
});