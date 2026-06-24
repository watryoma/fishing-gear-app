import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useDatabase, Item, Category } from '@/hooks/useDatabase';
import i18n from '@/constants/i18n';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getCategories, getItemsByCategory, deleteItem } = useDatabase();
  const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useState<Category | null>(null);

  useFocusEffect(
    useCallback(() => {
      const cats = getCategories();
      const found = cats.find((cat) => cat.id === id);
      setCategory(found ?? null);

      const data = getItemsByCategory(id as string);
      setItems(data);
    }, [id])
  );

  const handleDelete = (item: Item) => {
    Alert.alert(
      i18n.t('category.deleteTitle'),
      i18n.t('category.deleteMessage', { name: item.name }),
      [
        { text: i18n.t('common.cancel'), style: 'cancel' },
        {
          text: i18n.t('common.delete'),
          style: 'destructive',
          onPress: () => {
            deleteItem(item.id);
            const data = getItemsByCategory(id as string);
            setItems(data);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category?.name ?? i18n.t('category.defaultTitle')}</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemCard}
            onPress={() => router.push(`/item-detail?itemId=${item.id}`)}
          >
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCount}>{i18n.t('category.itemCount', { count: item.count })}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item)}
            >
              <Ionicons name="trash-outline" size={20} color="#ccc" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{i18n.t('category.empty')}</Text>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push(`/add-item?categoryId=${id}`)}
      >
        <Text style={styles.addButtonText}>{i18n.t('category.addItem')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  itemName: {
    fontSize: 15,
    flex: 1,
    marginRight: 10,
  },
  itemCount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A90D9',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteIcon: {
    fontSize: 18,
    opacity: 0.3,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 15,
  },
  addButton: {
    backgroundColor: '#4A90D9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});