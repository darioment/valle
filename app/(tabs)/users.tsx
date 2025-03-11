import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';

interface User {
  id: string;
  name: string;
}

const users: User[] = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Peter Jones' },
];

const UsersScreen = () => {
  return (
    <View>
      <Text>User Management</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: User }) => (
          <Text>{item.name}</Text>
        )}
      />
      <Button title="Add User" onPress={() => {}} />
    </View>
  );
};

export default UsersScreen;
