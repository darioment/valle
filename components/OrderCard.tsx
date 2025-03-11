import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Clock, DollarSign } from 'lucide-react-native';
import { Database } from '@/types/supabase';

type Order = Database['public']['Tables']['orders']['Row'];

interface OrderCardProps {
  order: Order;
  onPress: (order: Order) => void;
}

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return '#f59e0b';
    case 'preparing':
      return '#3b82f6';
    case 'completed':
      return '#10b981';
    case 'cancelled':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

const getStatusText = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'preparing':
      return 'Preparando';
    case 'completed':
      return 'Completado';
    case 'cancelled':
      return 'Cancelado';
    default:
      return status;
  }
};

export function OrderCard({ order, onPress }: OrderCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(order)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.orderId}>Orden #{order.id.slice(0, 8)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
      </View>

      <View style={styles.details}>
        {order.table_number && (
          <Text style={styles.tableNumber}>Mesa {order.table_number}</Text>
        )}
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Clock size={16} color="#6b7280" />
            <Text style={styles.infoText}>
              {new Date(order.created_at).toLocaleTimeString()}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <DollarSign size={16} color="#10b981" />
            <Text style={[styles.infoText, styles.amount]}>
              ${order.total_amount.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
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
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: Platform.select({ web: 'Inter_600SemiBold', default: 'Inter-SemiBold' }),
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Platform.select({ web: 'Inter_500Medium', default: 'Inter-Medium' }),
  },
  details: {
    gap: 8,
  },
  tableNumber: {
    fontSize: 14,
    color: '#4b5563',
    fontFamily: Platform.select({ web: 'Inter_500Medium', default: 'Inter-Medium' }),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: Platform.select({ web: 'Inter_400Regular', default: 'Inter-Regular' }),
  },
  amount: {
    color: '#10b981',
    fontWeight: '600',
    fontFamily: Platform.select({ web: 'Inter_600SemiBold', default: 'Inter-SemiBold' }),
  },
});