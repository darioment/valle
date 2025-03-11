import React from 'react';
import { View, Text, FlatList } from 'react-native';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
}

const orders: Order[] = [
  { id: '1', orderNumber: '12345', customerName: 'John Doe' },
  { id: '2', orderNumber: '67890', customerName: 'Jane Smith' },
  { id: '3', orderNumber: '13579', customerName: 'Peter Jones' },
];

const OrdersScreen = () => {
  return (
    <View>
      <Text>Order Management</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Order }) => (
          <Text>{item.orderNumber} - {item.customerName}</Text>
        )}
      />
    </View>
  );
};

export default OrdersScreen;
